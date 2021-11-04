import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, In } from 'typeorm';
import { Round } from './round.entity';
import { CreateRoundDTO, UpdateRoundDTO } from './round.dto';
import { validate } from 'class-validator';
import { Extra } from 'src/extra/extra.entity';

@Injectable()
export class RoundService {
    constructor(
        @InjectRepository(Round)
        private roundRepository : Repository<Round>
    ) {}

    /*
    * Create a new Round with the data received
    * @param  dto : Contains round's data
    * @return       the saved round
    */
    async createRound(dto: CreateRoundDTO): Promise<Round>{
        // create new round
        let newRound = new Round();
        newRound.pack = dto.pack;
        newRound.question = "Question";
        newRound.isMultipleChoice = true;
        newRound.choices = [];
        newRound.extra = null;
        
        return await this.roundRepository.save(newRound);
    }
  
    /*
    * Get all rounds
    * @return   All saved rounds
    */
    async getAllRounds(): Promise<Round[]>{
        return await this.roundRepository.find({relations: ["choices", "extra"]});
    }

    /*
    * Get a single round by the id given
    * @param  roundId
    * @return one round
    */
    async getRoundById(roundId): Promise<Round>{
        return await this.roundRepository.
                     findOne(roundId, {relations: ["choices", "extra", "pack"]});
    }

    /*
    * Update a round by the id and dto given
    * @param  roundId
    * @param  dto : data to update
    * @return the UpdateResult
    */
    async updateRound(roundId, dto: UpdateRoundDTO): Promise<Round>{
        let roundToUpdate = await this.roundRepository.findOne(roundId);
        roundToUpdate.question = dto.question;
        roundToUpdate.isMultipleChoice = dto.isMultipleChoice;
        return await this.roundRepository.save(roundToUpdate);
    }

    /*
    * Delete a round by the id given
    * @param  roundId
    * @return the DeleteResult
    */
    async deleteRound(roundId): Promise<DeleteResult>{
        return await this.roundRepository.delete(roundId);
    }
}
