import { Controller, Post, Res, Body, HttpStatus, Get,
    Param, Put, Delete, UseGuards } from '@nestjs/common';
import { RoundService } from './round.service';
import { CreateRoundDTO, UpdateRoundDTO } from './round.dto';

@Controller('round')
export class RoundController {
    constructor(
        private roundService: RoundService
    ){}

    @Post('')
    async createRound(@Res() res,
                         @Body() createRoundDTO: CreateRoundDTO){
        const round = await this.roundService.
                         createRound(createRoundDTO);
        return res.status(HttpStatus.OK).json(round);
    }

    @Get('')
    async getAllRounds(@Res() res){
        const rounds = await this.roundService.getAllRounds();
        return res.status(HttpStatus.OK).json(rounds);
    }
    
    @Get('/:id')
    async getRound(@Res() res, @Param('id') roundId){
        const round = await this.roundService.getRoundById(roundId);
        return res.status(HttpStatus.OK).json(round);
    }

    @Put('/:id')
    async updateRound( @Res() res, @Param('id') roundId,
                          @Body() dto: UpdateRoundDTO){
        const round = await this.roundService.
                     updateRound(roundId, dto);
        return res.status(HttpStatus.OK).json(round);
    }

    @Delete('/:id')
    async deleteRound(@Res() res, @Param('id') roundId){
        const deleteResult = await this.roundService.deleteRound(roundId);
        return res.status(HttpStatus.OK).json(deleteResult);
    }
}
