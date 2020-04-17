import { Controller, Post, Res, Body, HttpStatus, Get,
         Param, Put, Delete, UseGuards } from '@nestjs/common';
import { PackService } from './pack.service';
import { CreatePackDTO, UpdatePackDTO } from './pack.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('pack')
export class PackController {
    constructor(
        private packService: PackService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('')
    async createPack(@Res() res,
                         @Body() createPackDTO: CreatePackDTO){
        const pack = await this.packService.
                         createPack(createPackDTO);
        return res.status(HttpStatus.OK).json(pack);
    }

    @Get('')
    async getAllPacks(@Res() res){
        const packs = await this.packService.getAllPacks();
        return res.status(HttpStatus.OK).json(packs);
    }
    
    @Get('/:id')
    async getPack(@Res() res, @Param('id') packId){
        const pack = await this.packService.getPackById(packId);
        return res.status(HttpStatus.OK).json(pack);
    }

    @Put('/:id')
    async updatePack( @Res() res, @Param('id') packId,
                          @Body() dto: UpdatePackDTO){
        const pack = await this.packService.
                     updatePack(packId, dto);
        return res.status(HttpStatus.OK).json(pack);
    }

    @Delete('/:id')
    async deletePack(@Res() res, @Param('id') packId){
        const deleteResult = await this.packService.deletePack(packId);
        return res.status(HttpStatus.OK).json(deleteResult);
    }
}
