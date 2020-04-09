import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, In } from 'typeorm';
import { Choice } from './choice.entity';
import { CreateChoiceDTO, UpdateChoiceDTO } from './choice.dto';
import { validate } from 'class-validator';

@Injectable()
export class ChoiceService {
    constructor(
        @InjectRepository(Choice)
        private choiceRepository : Repository<Choice>
    ) {}

    /*
    * Create a new Choice with the data received
    * @param  dto : Contains choice's data
    * @return       the saved choice
    */
    async createChoice(dto: CreateChoiceDTO): Promise<Choice>{
        const { round, choice } = dto;

        // create new choice
        let newChoice = new Choice();
        newChoice.round = round;
        newChoice.choice = choice;

        const errors = await validate(newChoice);
        if (errors.length > 0) {
            const _errors = {name: 'Choice input is not valid.'};
            throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
        } else {
            return await this.choiceRepository.save(newChoice);
        }
    }
  
    /*
    * Get all choices
    * @return   All saved choices
    */
    async getAllChoices(): Promise<Choice[]>{
        return await this.choiceRepository.find();
    }

    /*
    * Get a single choice by the id given
    * @param  choiceId
    * @return one choice
    */
    async getChoiceById(choiceId): Promise<Choice>{
        return await this.choiceRepository.findOne(choiceId);
    }

    /*
    * Update a choice by the id and dto given
    * @param  choiceId
    * @param  dto : data to update
    * @return the UpdateResult
    */
    async updateChoice(choiceId, dto: UpdateChoiceDTO): Promise<Choice>{
        let choiceToUpdate = await this.choiceRepository.findOne(choiceId);
        choiceToUpdate.choice = dto.choice;
        return await this.choiceRepository.save(choiceToUpdate);
    }

    /*
    * Delete a choice by the id given
    * @param  choiceId
    * @return the DeleteResult
    */
    async deleteChoice(choiceId): Promise<DeleteResult>{
        return await this.choiceRepository.delete(choiceId);
    }
}
