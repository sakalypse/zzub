import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, In, Not } from 'typeorm';
import { Pack } from './pack.entity';
import { Tag } from 'src/tag/tag.entity';
import { CreatePackDTO, UpdatePackDTO } from './pack.dto';
import { validate } from 'class-validator';
import { User } from 'src/user/user.entity';
import { stringify } from 'querystring';

@Injectable()
export class PackService {
    constructor(
        @InjectRepository(Pack)
        private packRepository : Repository<Pack>,
        @InjectRepository(Tag)
        private tagRepository : Repository<Tag>,
        @InjectRepository(User)
        private userRepository : Repository<User>
    ) {}

    /*
    * Create a new Pack with the data received
    * @param  dto : Contains pack's data
    * @return       the saved pack
    */
    async createPack(dto: CreatePackDTO): Promise<Pack>{
        const author = await this.userRepository.findOne(dto.author);

        // create new pack
        let newPack = new Pack();
        let idName = 0;
        newPack.name = author.username;
        newPack.author = dto.author;
        newPack.isPublic = false;
        newPack.language = 0;
        newPack.rounds = [];

        let packSearched;
        do{
            idName++;
            newPack.name=author.username+idName.toString();
            packSearched = await this.packRepository.
            findOne({where:{ name: newPack.name}});
        }while(packSearched!=null)

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
        return await this.packRepository.find({relations: ["author", "tag"]});
    }

    /*
    * Get a single pack by the id given
    * @param  packId
    * @return one pack
    */
    async getPackById(packId): Promise<Pack>{
        return await this.packRepository.findOne(packId, {relations: ["author", "tag"]});
    }

    /*
    * Get a single pack by the name given
    * @param  name
    * @return one pack
    */
    async getPackByName(name): Promise<Pack>{
        return await this.packRepository.findOne({name: name}, {relations: ["author", "tag"]});
    }

    /*
    * Update a pack by the id and dto given
    * @param  packId
    * @param  dto : data to update
    * @return the pack updated
    */
    async updatePack(packId, dto: UpdatePackDTO): Promise<Pack>{
        let packToUpdate = await this.packRepository.findOne(packId);
        
        // check uniqueness of name
        if(packToUpdate.name != dto.name){
            const packSearched = await this.packRepository.
            findOne({where:{ name: dto.name}});
            if (packSearched) {
            const errors = {name: 'Name already taken.'};
            throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
            }
        }

        packToUpdate.name = dto.name;
        packToUpdate.tag = dto.tag;
        packToUpdate.isPublic = dto.isPublic;
        if(dto.language<0||dto.language>3)
            throw new HttpException({message: 'Language not valid'}, HttpStatus.BAD_REQUEST);
        packToUpdate.language = dto.language;

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
