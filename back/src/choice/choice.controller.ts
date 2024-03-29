import { Controller, Post, Res, Body, HttpStatus, Get,
         Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { CreateChoiceDTO, UpdateChoiceDTO } from './choice.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { UserBodyGuard } from 'src/auth/user-body.guard';
import { UserGuard } from 'src/auth/user.guard';

@Controller('choice')
export class ChoiceController {
    constructor(
        private choiceService: ChoiceService
    ){}

    @UseGuards(UserBodyGuard)
    @Post('')
    async createChoice(@Res() res,
                         @Body() createChoiceDTO: CreateChoiceDTO){
        const choice = await this.choiceService.
                         createChoice(createChoiceDTO);
        return res.status(HttpStatus.OK).json(choice);
    }

    @UseGuards(AdminGuard)
    @Get('')
    async getAllChoices(@Res() res){
        const choices = await this.choiceService.getAllChoices();
        return res.status(HttpStatus.OK).json(choices);
    }
    
    @UseGuards(AdminGuard)
    @Get('/:id')
    async getChoice(@Res() res, @Param('id') choiceId){
        const choice = await this.choiceService.getChoiceById(choiceId);
        return res.status(HttpStatus.OK).json(choice);
    }

    @UseGuards(UserGuard)
    @Put('/:choiceId')
    async updateChoice( @Res() res, @Param('choiceId') choiceId,
                          @Body() dto: UpdateChoiceDTO){
        const choice = await this.choiceService.
                     updateChoice(choiceId, dto);
        return res.status(HttpStatus.OK).json(choice);
    }

    @UseGuards(UserGuard)
    @Delete('/:choiceId')
    async deleteChoice(@Res() res, @Param('choiceId') choiceId){
        const deleteResult = await this.choiceService.deleteChoice(choiceId);
        return res.status(HttpStatus.OK).json(deleteResult);
    }
}
