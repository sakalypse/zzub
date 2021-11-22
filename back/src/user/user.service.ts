import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, LessThan, Not } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO, ReturnedUserDTO, CreateGuestDTO, ReturnedGuestDTO } from './user.dto';
import * as bcrypt from "bcryptjs";
import { NotEquals, validate } from 'class-validator';
import { Pack } from 'src/pack/pack.entity';
import { Role } from 'src/shared/role.enum';
import { Game } from 'src/game/game.entity';

//let role = require("src/shared/role.enum");

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
        @InjectRepository(Pack)
        private packRepository : Repository<Pack>
    ) {}

    /*
    * Create admin User
    */
    async createAdmin(username, email, password){
        // check if null
        if(username && email && password){
            // check uniqueness of username/email
            const userSearched = await this.userRepository.
                findOne({ username: username, email: email });
            if(userSearched){
                console.log("Admin already created");
                return;
            }
            // create new user
            let newUser = new User();
            newUser.username = username
            newUser.email = email;
            newUser.password = bcrypt.hashSync(password, 10);
            newUser.role = Role.admin;
            
            this.userRepository.save(newUser);
        }
        else{
            console.log("Admin's data missing");
            return;
        }
    }

    /*
    * Create a new User with the data received
    * @param  dto : Contains user's data
    * @return       the saved user
    */
    async createUser(dto: CreateUserDTO): Promise<ReturnedUserDTO>{
        let { username, email, password } = dto;
        username = username.toLowerCase();
        email = email.toLowerCase();
        // check uniqueness of username/email for non guest user (notequals 3)
        const userSearched = await this.userRepository
                    .findOne({ where: [{username: username, role: Not(3)}, {email: email, role: Not(3)}]});
        if (userSearched) {
            const errors = {username: 'Username and/or email already taken.'};
            throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
        }

        // create new user
        let newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = bcrypt.hashSync(password, 10);
        newUser.role = Role.user;

        const errors = await validate(newUser);
        if (errors.length > 0) {
            const _errors = {username: 'User input is not valid.'};
            throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
        } else {
            const savedUser = await this.userRepository.save(newUser);
            const { password, ...result } = savedUser;
            return result;
        }
    }
  
    /*
    * Get all users
    * @return   All saved users
    */
    async getAllUsers(): Promise<ReturnedUserDTO[]>{
        const users = await this.userRepository.find();
        let returnedUsers = [];
        users.forEach(user => {
            const { password, ...result } = user;
            returnedUsers.push(result);
        });
        return returnedUsers;
    }

    /*
    * Get a single user by the id given
    * @param  userId
    * @return one user
    */
    async getUserById(userId): Promise<ReturnedUserDTO>{
        const user = await this.userRepository.findOne(userId);
        const { password, ...result } = user;
        return result;
    }

    /*
    * Get safe infos from single user by the id given : May be ask by another user
    * @param  userId
    * @return one user
    */
    async getUserSafeInfoById(userId): Promise<ReturnedUserDTO>{
        const user = await this.userRepository.findOne(userId);
        let userReturn = new User();
        userReturn = { userId :user.userId, username:user.username, game:user.game, hostGame:user.hostGame,
                        email:null, password:null, role:null, packs:null, favorites:null };
        return userReturn;
    }

    /*
    * Get a single user by the id given
    * @param  userId
    * @return one user
    */
    async getUserByUsername(username): Promise<ReturnedUserDTO>{
        const user = await this.userRepository.findOne({username: username});
        const { password, ...result } = user;
        return result;
    }

    /*
    * Get a single user by the id given for authentification -> keep hashed password
    * @param  userId
    * @return one user
    */
    async getUserByUsernameForAuth(username): Promise<User>{
        return await this.userRepository.findOne({username: username});
    }   
    async getUserByIdForAuth(id): Promise<User>{
        return await this.userRepository.findOne({where:{userId: id}, relations: ["game", "hostGame"]});
    } 

    /*
    * Update a user by the id and dto given
    * @param  userId
    * @param  dto : data to update
    * @return the user updated
    */
    async updateUser(userId, dto): Promise<ReturnedUserDTO>{
        let userToUpdate = await this.userRepository.findOne(userId);
        
        userToUpdate.username = dto.username;
        userToUpdate.email = dto.email;
        userToUpdate.password = dto.password;
        userToUpdate.game = dto.game;
        userToUpdate.hostGame = dto.hostGame;


        const user = await this.userRepository.save(userToUpdate);
        const { password, ...result } = user;
        return result;
    }

    /*
    * Delete a user by the id given
    * @param  userId
    * @return the DeleteResult
    */
    async deleteUser(userId): Promise<DeleteResult>{
        return await this.userRepository.delete(userId);
    }


    /*
    * Get all packs of a user
    * @param  userId
    * @return All saved packs of user
    */
    async getAllPacksOfUser(userId): Promise<Pack[]>{
        const packs = await this.packRepository.find({
            relations: ["author", "rounds", "tag"],
            where:{author:{userId: userId}}});
        
        //remove hashed password from returned data
        packs.forEach(pack => {
            pack.author.password = "";
        });

        return packs;
    }

    /*
    * Get single pack of a user
    * @param  userId
    * @param  packId
    * @return saved pack of user
    */
    async getPackOfUser(userId, packId): Promise<Pack>{
        const pack = await this.packRepository.findOne({
        relations: ["author", "tag", "rounds",
                    "rounds.choices", "rounds.extra"],
        where:{author:{userId: userId}, packId}});

        //remove hashed password from returned data
        if(pack){
            pack.author.password = "";
            return pack;
        }
        else   
            return null;
    }

    /*
    * Get all favorties packs of a user
    * @param  userId
    * @return All favorites packs of user
    */
    async getAllFavoritesPacksOfUser(userId): Promise<Pack[]>{
        const user = await this.userRepository.findOne({
            relations: ["favorites", "favorites.author", "favorites.rounds", "favorites.tag"],
            where:{userId: userId}});
        const packs = user.favorites;

        //remove hashed password from returned data
        packs.forEach(pack => {
            pack.author.password = "";
        });
        
        return packs;
    }

    /*
    * Add a pack to a user
    * @param  userId, packId
    */
    async favoritesPackToUser(userId, packId): Promise<ReturnedUserDTO>{
        const user = await this.userRepository.findOne({
            relations:["favorites"],
            where:{userId: userId}});
        if(!user)
            throw new HttpException({message: 'User not known'}, HttpStatus.BAD_REQUEST);
        const pack = await this.packRepository.findOne({
            where:{packId: packId}});
        if(!pack)
            throw new HttpException({message: 'Pack not known'}, HttpStatus.BAD_REQUEST);

        user.favorites.push(pack);
        const userSaved = await this.userRepository.save(user);
        const { password, ...result } = userSaved;
        return result;
    }

    /*
    * Remove the favorite pack from a user
    * @param  userId, packId
    */
    async deleteFavoritesPackToUser(userId, packId): Promise<ReturnedUserDTO>{
        const user = await this.userRepository.findOne({
            relations:["favorites"],
            where:{userId: userId}});
        if(!user)
            throw new HttpException({message: 'User not known'}, HttpStatus.BAD_REQUEST);
        const pack = await this.packRepository.findOne({
            where:{packId: packId}});
        if(!pack)
            throw new HttpException({message: 'Pack not known'}, HttpStatus.BAD_REQUEST);

        user.favorites = user.favorites.filter(x => x.packId != pack.packId);
        const userSaved = await this.userRepository.save(user);
        const { password, ...result } = userSaved;
        return result;
    }


    async getGameOfUser(userId): Promise<Game>{
        const user = await this.userRepository.findOne({
        relations: ["game"],
        where:{userId}});
        return user.game;
    }


    
    //#region Guest
    /*
    * Create a new Guest with the data received
    * @param  dto : Contains guest's data
    * @return       the saved guest
    */
   async createGuest(dto: CreateGuestDTO): Promise<ReturnedGuestDTO>{
        let { username, game } = dto;
        // create new guest
        let newGuest = new User();
        newGuest.username = username.toLowerCase();
        newGuest.email = "";
        newGuest.password = "";
        //newGuest.game = game;
        newGuest.role = Role.guest;

        return await this.userRepository.save(newGuest);
    }

    /*
    * Get all guests by game
    * @return   All saved guests
    */
    async getAllGuestsByGame(idGame): Promise<ReturnedGuestDTO[]>{
        return await this.userRepository.find({game: idGame});
    }

    /*
    * Get guest by id
    * @return  guest
    */
    async getGuestById(id): Promise<ReturnedGuestDTO>{
        return await this.userRepository.findOne(id,{relations: ["game"]});
    }
    //#endregion
}
