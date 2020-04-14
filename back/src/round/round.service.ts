import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, In } from 'typeorm';
import { Round } from './round.entity';
import { CreateRoundDTO, UpdateRoundDTO } from './round.dto';
import { validate } from 'class-validator';

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
        const { pack, question, isMultipleChoice, answerSingleChoice } = dto;

        // create new round
        let newRound = new Round();
        newRound.pack = pack;
        newRound.question = question;
        newRound.isMultipleChoice = isMultipleChoice;
        if(!newRound.isMultipleChoice && answerSingleChoice)
            newRound.answerSingleChoice = answerSingleChoice;
        newRound.choices = [];
        newRound.extras = [];

        const errors = await validate(newRound);
        if (errors.length > 0) {
            const _errors = {name: 'Round input is not valid.'};
            throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
        } else {
            return await this.roundRepository.save(newRound);
        }
    }
  
    /*
    * Get all rounds
    * @return   All saved rounds
    */
    async getAllRounds(): Promise<Round[]>{
        return await this.roundRepository.find({relations: ["choices", "extras"]});
    }

    /*
    * Get a single round by the id given
    * @param  roundId
    * @return one round
    */
    async getRoundById(roundId): Promise<Round>{
        return await this.roundRepository.
                     findOne(roundId, {relations: ["choices", "extras"]});
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
        if(!roundToUpdate.isMultipleChoice && dto.answerSingleChoice)
            roundToUpdate.answerSingleChoice = dto.answerSingleChoice;
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
