import { Controller, Post, Res, Body, HttpStatus, Get,
         Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ExtraService } from './extra.service';
import { CreateExtraDTO, UpdateExtraDTO } from './extra.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { UserBodyGuard } from 'src/auth/user-body.guard';

@Controller('extra')
export class ExtraController {
    constructor(
        private extraService: ExtraService
    ){}

    @UseGuards(UserBodyGuard)
    @Post('')
    async createExtra(@Res() res,
                      @Body() createExtraDTO: CreateExtraDTO){
        const extra = await this.extraService.
                         createExtra(createExtraDTO);
        return res.status(HttpStatus.OK).json(extra);
    }

    @UseGuards(AdminGuard)
    @Get('')
    async getAllExtras(@Res() res){
        const extras = await this.extraService.getAllExtras();
        return res.status(HttpStatus.OK).json(extras);
    }
    
    @UseGuards(AdminGuard)
    @Get('/:id')
    async getExtra(@Res() res, @Param('id') extraId){
        const extra = await this.extraService.getExtraById(extraId);
        return res.status(HttpStatus.OK).json(extra);
    }

    @UseGuards(AdminGuard)
    @Put('/:id')
    async updateExtra( @Res() res, @Param('id') extraId,
                          @Body() dto: UpdateExtraDTO){
        const extra = await this.extraService.
                     updateExtra(extraId, dto);
        return res.status(HttpStatus.OK).json(extra);
    }
    
    @UseGuards(AdminGuard)
    @Delete('/:id')
    async deleteExtra(@Res() res, @Param('id') extraId){
        const deleteResult = await this.extraService.deleteExtra(extraId);
        return res.status(HttpStatus.OK).json(deleteResult);
    }
}
