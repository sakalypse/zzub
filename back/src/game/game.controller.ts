import { Controller, Get, Post, Res, Body, HttpStatus, Param, Put, Delete } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDTO } from './game.dto';
import { User } from 'src/user/user.entity';

@Controller('game')
export class GameController {
    constructor(private gameService: GameService){}

    @Post('/create')
    async createGame(@Res() res, @Body() game: CreateGameDTO){
      const newGame = await this.gameService.
                        createGame(game);

      return res.status(HttpStatus.OK).json({
          code: newGame.code
      })
    }
  
    //TODO Guard handle security
    @Put(':gameId/adduser/:userId')
    async addUserToGame(@Res() res, @Param('gameId') gameId, @Param('userId') userId){
      const userRes = await this.gameService.
                        addUserToGame(userId, gameId);

      return res.status(HttpStatus.OK).json("User : " + userRes.userId + " successfully added to the game")
    }

    @Put(':gameId/removeuser/:userId')
    async removeUserToGame(@Res() res, @Param('gameId') gameId, @Param('userId') userId){
      const userRes = await this.gameService.
                        removeUserToGame(userId, gameId);
  
      return res.status(HttpStatus.OK).json("User : " + userRes.userId + " successfully removed from the game")
    }
  
    @Get('/:id')
    async getGameById(@Res() res, @Param('id') id){
      const game = await this.gameService.
                        getgameById(id);
      return res.status(HttpStatus.OK).json(game)
    }

    @Get('/code/:id')
    async getGameByCode(@Res() res, @Param('id') id){
      const game = await this.gameService.
                        getGameByCode(id);
      return res.status(HttpStatus.OK).json(game)
    }
  
    @Delete('/delete/:id')
    async deleteGame(@Res() res,  @Param('id') id){
      const categories = await this.gameService.deleteGameById(id);
          return res.status(HttpStatus.OK).json({message:"Game " + id + " successfully deleted"});
    }
  
    @Get('')
    async findAll(@Res() res) {
      const games = await this.gameService.getAllGame();
      return res.status(HttpStatus.OK).json(games);
    }
}
