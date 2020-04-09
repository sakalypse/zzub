import { Controller, Post, Res, Body, HttpStatus, Get,
         Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { CreateChoiceDTO, UpdateChoiceDTO } from './choice.dto';

@Controller('choice')
export class ChoiceController {
    constructor(
        private choiceService: ChoiceService
    ){}

    @Post('')
    async createChoice(@Res() res,
                         @Body() createChoiceDTO: CreateChoiceDTO){
        const choice = await this.choiceService.
                         createChoice(createChoiceDTO);
        return res.status(HttpStatus.OK).json(choice);
    }

    @Get('')
    async getAllChoices(@Res() res){
        const choices = await this.choiceService.getAllChoices();
        return res.status(HttpStatus.OK).json(choices);
    }
    
    @Get('/:id')
    async getChoice(@Res() res, @Param('id') choiceId){
        const choice = await this.choiceService.getChoiceById(choiceId);
        return res.status(HttpStatus.OK).json(choice);
    }

    @Put('/:id')
    async updateChoice( @Res() res, @Param('id') choiceId,
                          @Body() dto: UpdateChoiceDTO){
        const choice = await this.choiceService.
                     updateChoice(choiceId, dto);
        return res.status(HttpStatus.OK).json(choice);
    }

    @Delete('/:id')
    async deleteChoice(@Res() res, @Param('id') choiceId){
        const deleteResult = await this.choiceService.deleteChoice(choiceId);
        return res.status(HttpStatus.OK).json(deleteResult);
    }
}
