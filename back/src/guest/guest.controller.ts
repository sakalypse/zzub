import { Controller, Post, Res, Body, HttpStatus, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CreateGuestDTO } from './guest.dto';
import { GuestService } from './guest.service';
import { GuestGuard } from 'src/auth/guest.guard';

@Controller('guest')
export class GuestController {
    constructor(
        private guestService: GuestService,
    ){}

    @Post('')
    async createGuest(@Res() res, @Body() createGuestDTO: CreateGuestDTO){
        const guest = await this.guestService.createGuest(createGuestDTO);
        return res.status(HttpStatus.OK).json(guest);
    }

    @Get('bygame/:id')
    async getAllGuestsByGame(@Res() res, @Param('id') gameId){
        const guests = await this.guestService.getAllGuestsByGame(gameId);
        return res.status(HttpStatus.OK).json(guests);
    }

    @Get('/:id')
    async getGuest(@Res() res, @Param('id') guestId){
        const guest = await this.guestService.getGuestById(guestId);
        return res.status(HttpStatus.OK).json(guest);
    }

    @UseGuards(GuestGuard)
    @Delete('/:id')
    async deleteGuest(@Res() res, @Param('id') guestId){
        const deleteResult = await this.guestService.deleteGuest(guestId);
        return res.status(HttpStatus.OK).json(deleteResult);
    }
}
