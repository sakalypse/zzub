import { Controller, Get, Post, Res, Body, HttpStatus, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { GameService } from './game.service';
import { CreateGameDTO } from './game.dto';
import { User } from 'src/user/user.entity';
import { GameGuard } from 'src/auth/game.guard';

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
  
    @UseGuards(GameGuard)
    @Put(':gameId/adduser/:userId')
    async addUserToGame(@Res() res, @Param('gameId') gameId, @Param('userId') userId){
      const userRes = await this.gameService.
                        addUserToGame(userId, gameId);

      return res.status(HttpStatus.OK).json("User : " + userRes.userId + " successfully added to the game")
    }

    @UseGuards(GameGuard)
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

    @Get('/code/:code')
    async getGameByCode(@Res() res, @Param('code') code){
      const game = await this.gameService.
                        getGameByCode(code);
      return res.status(HttpStatus.OK).json(game)
    }
  
    @UseGuards(GameGuard)
    @Delete('/delete/:gameId')
    async deleteGame(@Res() res,  @Param('gameId') gameId){
      const categories = await this.gameService.deleteGameById(gameId);
          return res.status(HttpStatus.OK).json({message:"Game " + gameId + " successfully deleted"});
    }
  
    @Get('')
    async findAll(@Res() res) {
      const games = await this.gameService.getAllGame();
      return res.status(HttpStatus.OK).json(games);
    }
}
