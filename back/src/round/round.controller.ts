import { Controller, Post, Res, Body, HttpStatus, Get,
    Param, Put, Delete, UseGuards } from '@nestjs/common';
import { RoundService } from './round.service';
import { CreateRoundDTO, UpdateRoundDTO } from './round.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { UserBodyGuard } from 'src/auth/user-body.guard';
import { UserGuard } from 'src/auth/user.guard';

@Controller('round')
export class RoundController {
    constructor(
        private roundService: RoundService
    ){}


    //TODO : check if pack exist
    @UseGuards(UserBodyGuard)
    @Post('')
    async createRound(@Res() res,
                         @Body() createRoundDTO: CreateRoundDTO){
        const round = await this.roundService.
                         createRound(createRoundDTO);
        return res.status(HttpStatus.OK).json(round);
    }

    @UseGuards(AdminGuard)
    @Get('')
    async getAllRounds(@Res() res){
        const rounds = await this.roundService.getAllRounds();
        return res.status(HttpStatus.OK).json(rounds);
    }
    
    @UseGuards(AdminGuard)
    @Get('/:id')
    async getRound(@Res() res, @Param('id') roundId){
        const round = await this.roundService.getRoundById(roundId);
        return res.status(HttpStatus.OK).json(round);
    }

    @UseGuards(UserGuard)
    @Put('/:roundId')
    async updateRound( @Res() res, @Param('roundId') roundId,
                          @Body() dto: UpdateRoundDTO){
        const round = await this.roundService.
                     updateRound(roundId, dto);
        return res.status(HttpStatus.OK).json(round);
    }

    @UseGuards(UserGuard)
    @Delete('/:roundId')
    async deleteRound(@Res() res, @Param('roundId') roundId){
        const deleteResult = await this.roundService.deleteRound(roundId);
        return res.status(HttpStatus.OK).json(deleteResult);
    }
}
