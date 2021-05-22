import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from 'src/user/user.entity';
import { ReturnedGuestDTO, CreateGuestDTO } from './guest.dto';
import { Guest } from './guest.entity';
import { Game } from 'src/game/game.entity';

@Injectable()
export class GuestService {
    constructor(
        @InjectRepository(Guest)
        private guestRepository : Repository<Guest>
    ) {}


    /*
    * Create a new Guest with the data received
    * @param  dto : Contains guest's data
    * @return       the saved guest
    */
   async createGuest(dto: CreateGuestDTO): Promise<ReturnedGuestDTO>{
        let { username, game } = dto;
        username = username.toLowerCase();
        
        // create new guest
        let newGuest = new Guest();
        newGuest.username = username;
        newGuest.game = game;

        return await this.guestRepository.save(newGuest);
    }

    /*
    * Get all guests by game
    * @return   All saved guests
    */
    async getAllGuestsByGame(idGame): Promise<ReturnedGuestDTO[]>{
        return await this.guestRepository.find({game: idGame});
    }

    /*
    * Get guest by id
    * @return  guest
    */
    async getGuestById(id): Promise<ReturnedGuestDTO>{
        return await this.guestRepository.findOne(id,{relations: ["game"]});
    }

    /*
    * Delete a guest by the id given
    * @param  guestId
    * @return the DeleteResult
    */
    async deleteGuest(guestId): Promise<DeleteResult>{
        return await this.guestRepository.delete(guestId);
    }
}
