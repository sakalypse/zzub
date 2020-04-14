import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, In } from 'typeorm';
import { Pack } from './pack.entity';
import { Tag } from 'src/tag/tag.entity';
import { CreatePackDTO, UpdatePackDTO } from './pack.dto';
import { validate } from 'class-validator';

@Injectable()
export class PackService {
    constructor(
        @InjectRepository(Pack)
        private packRepository : Repository<Pack>,
        @InjectRepository(Tag)
        private tagRepository : Repository<Tag>
    ) {}

    /*
    * Create a new Pack with the data received
    * @param  dto : Contains pack's data
    * @return       the saved pack
    */
    async createPack(dto: CreatePackDTO): Promise<Pack>{
        const { name, author, tags } = dto;

        // check uniqueness of name
        const packSearched = await this.packRepository.
                    findOne({ name: name });
        if (packSearched) {
            const errors = {name: 'Name already taken.'};
            throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
        }

        // create new pack
        let newPack = new Pack();
        newPack.name = name;
        newPack.author = author;
        newPack.rounds = [];

        if(tags!=null){
            newPack.tags = [];
            await this.tagRepository.find({tagId: In(tags)}).
            then(tagsFound => {
                for(const tag of tagsFound){
                    newPack.tags.push(tag);
                }
            })
        }
        else   
            newPack.tags = [];

        const errors = await validate(newPack);
        if (errors.length > 0) {
            const _errors = {name: 'Pack input is not valid.'};
            throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
        } else {
            return await this.packRepository.save(newPack);
        }
    }
  
    /*
    * Get all packs
    * @return   All saved packs
    */
    async getAllPacks(): Promise<Pack[]>{
        return await this.packRepository.find({relations: ["author", "tags"]});
    }

    /*
    * Get a single pack by the id given
    * @param  packId
    * @return one pack
    */
    async getPackById(packId): Promise<Pack>{
        return await this.packRepository.findOne(packId, {relations: ["author", "tags"]});
    }

    /*
    * Get a single pack by the name given
    * @param  name
    * @return one pack
    */
    async getPackByName(name): Promise<Pack>{
        return await this.packRepository.findOne({name: name}, {relations: ["author", "tags"]});
    }

    /*
    * Update a pack by the id and dto given
    * @param  packId
    * @param  dto : data to update
    * @return the pack updated
    */
    async updatePack(packId, dto: UpdatePackDTO): Promise<Pack>{
        let packToUpdate = await this.packRepository.findOne(packId);
        
        packToUpdate.name = dto.name;
        if(dto.tags!=null){
            packToUpdate.tags = [];
            await this.tagRepository.find({tagId: In(dto.tags)}).
            then(tagsFound => {
                for(const tag of tagsFound){
                    packToUpdate.tags.push(tag);
                }
            })
        }

        return await this.packRepository.save(packToUpdate);
    }

    /*
    * Delete a pack by the id given
    * @param  packId
    * @return the DeleteResult
    */
    async deletePack(packId): Promise<DeleteResult>{
        return await this.packRepository.delete(packId);
    }
}
