import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateGameDTO } from './game.dto';
import { User } from 'src/user/user.entity';
import { PackService } from 'src/pack/pack.service';
var randomstring = require("randomstring");

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private readonly gameRepository : Repository<Game>,
        @Inject(UserService)
        private readonly userService : UserService,
        @Inject(PackService)
        private readonly packService : PackService
        ) {}

    //Create a game
    async createGame(createGame: CreateGameDTO): Promise<Game>{
        let game = new Game(); 
        game.dateCreation = new Date();
        await this.userService.getUserByIdForAuth(createGame.owner).
        then(async user=>{
            //if the user has already a game : stop here
            if(user.hostGame!=null){
                throw new HttpException('Already has game', HttpStatus.FORBIDDEN);
            }

            //user.hostGame = game;
            game.owner = user;
            game.pack = [];
            game.players = [user];
            //user.game = game;
            createGame.pack.forEach(async newPack => {
                game.pack.push(await this.packService.getPackById(newPack.packId));
            });
            //await this.userService.updateUser(user.userId, user);
        }).catch(error => {throw new
                            HttpException(error,
                             HttpStatus.FORBIDDEN)});

        //generate code
        do{
            game.code = randomstring.generate(4).toUpperCase();
            var codeAlreadyExist = await this.getGameByCode(game.code);
        }while(codeAlreadyExist!=undefined && codeAlreadyExist!=null);

        return await this.gameRepository.save(game);
    }

    //Get a single game by its ID
    async getgameById(gameId): Promise<Game>{
        var game = await this.gameRepository.
                        findOne(gameId,
                                {relations: ["owner",
                                            "players" ,
                                            "pack"]});
        if(game!=null){                           
            game.owner.password = "";
            game.players.forEach(player => {
                player.password = "";
            });
        }

        return game;
    }

    async getGameByCode(code) : Promise<Game>{
        var game = await this.gameRepository
                        .findOne({ code: code},
                                    {relations: ["owner",
                                                "players" ,
                                                "pack"]});
        if(game!=null){
            game.owner.password = "";
            game.players.forEach(player => {
                player.password = "";
            });
        }

        return game;
    }

    //get all games
    async getAllGame(): Promise<Game[]>{
        return await this.gameRepository.
                        find({relations: ["owner",
                                        "players",
                                        "pack"]});
    }

    //Add a user to a game
    async addUserToGame(userId, gameId): Promise<User>{
        const game = await this.gameRepository
                                .findOne(gameId,
                                    {relations: ["players"]});
        let user;
        await this.userService.getUserByIdForAuth(userId).
        then(result=>{
            user=result;
            //if the user has already a game : stop here
            if(user.game!=null)
                throw new HttpException('Already has game', HttpStatus.FORBIDDEN);
            user.game = game;
            this.userService.updateUser(user.userId, user);
        }).catch(error => {throw new
            HttpException(error,
             HttpStatus.FORBIDDEN)});
        return user;
    }

    //Remove a user to a game
    async removeUserToGame(userId, gameId): Promise<User>{
        var user;
        await this.userService.getUserByIdForAuth(userId).
        then(async userFound =>{
            user = userFound;
            user.game = null;
            this.userService.updateUser(userId, user);
            /*
            if(user.guest){
                await this.userService.deleteUserById(user.userId)
            }
            */
        }).catch(error => {throw new
            HttpException(error,
             HttpStatus.FORBIDDEN)});
        return user;
    }

    //delete game by id
    async deleteGameById(gameId){
        const game = await this.gameRepository
                                .findOne(gameId,
                                    {relations: ["players","owner","pack"]});

        //delete users that are guests
        /*
        game.players.forEach(async player => {
            if(player.guest){
                await this.userService.deleteUserById(player.userId)
            }
        });
        */

        //update current games of each user to null
        game.owner.hostGame=null;
        await this.userService.updateUser(  game.owner.userId,
                                            game.owner);
                                            
        game.players = [];
        game.owner = null;
        game.pack = [];
        await this.gameRepository.save(game);         
                    
        await this.gameRepository.remove(game);
    }
}
