import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, In } from 'typeorm';
import { Extra } from './extra.entity';
import { CreateExtraDTO, UpdateExtraDTO } from './extra.dto';
import { validate } from 'class-validator';

@Injectable()
export class ExtraService {
    constructor(
        @InjectRepository(Extra)
        private extraRepository : Repository<Extra>
    ) {}

    /*
    * Create a new Extra with the data received
    * @param  dto : Contains extra's data
    * @return       the saved extra
    */
    async createExtra(dto: CreateExtraDTO): Promise<Extra>{
        const { round, url } = dto;

        // create new extra
        let newExtra = new Extra();
        newExtra.round = round;
        newExtra.url = url;

        const errors = await validate(newExtra);
        if (errors.length > 0) {
            const _errors = {name: 'Extra input is not valid.'};
            throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
        } else {
            return await this.extraRepository.save(newExtra);
        }
    }
  
    /*
    * Get all extras
    * @return   All saved extras
    */
    async getAllExtras(): Promise<Extra[]>{
        return await this.extraRepository.find();
    }

    /*
    * Get a single extra by the id given
    * @param  extraId
    * @return one extra
    */
    async getExtraById(extraId): Promise<Extra>{
        return await this.extraRepository.findOne(extraId);
    }

    /*
    * Update a extra by the id and dto given
    * @param  extraId
    * @param  dto : data to update
    * @return the UpdateResult
    */
    async updateExtra(extraId, dto: UpdateExtraDTO): Promise<Extra>{
        let extraToUpdate = await this.extraRepository.findOne(extraId);
        extraToUpdate.url = dto.url;
        return await this.extraRepository.save(extraToUpdate);
    }

    /*
    * Delete a extra by the id given
    * @param  extraId
    * @return the DeleteResult
    */
    async deleteExtra(extraId): Promise<DeleteResult>{
        return await this.extraRepository.delete(extraId);
    }
}
