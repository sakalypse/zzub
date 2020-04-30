import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDTO } from './tag.dto';
import { validate } from 'class-validator';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(Tag)
        private tagRepository : Repository<Tag>
    ) {}

    /*
    * Create Default tags
    */
   async initDefaultTags(){
    let tags = [
        "Sport",
        "Music",
        "History",
        "Cinema"
    ]
    tags.forEach(tag => {
        let tagToSave = new Tag();
        tagToSave.name = tag;
        this.tagRepository.save(tagToSave);
    });
}

    /*
    * Create a new Tag with the data received
    * @param  dto : Contains tag's data
    * @return       the saved tag
    */
    async createTag(dto: CreateTagDTO): Promise<Tag>{
        const { name } = dto;

        // check uniqueness of name
        const tagSearched = await this.tagRepository.
                    findOne({ name: name });
        if (tagSearched) {
            const errors = {name: 'Name already taken.'};
            throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
        }

        // create new tag
        let newTag = new Tag();
        newTag.name = name;
        newTag.packs = [];

        const errors = await validate(newTag);
        if (errors.length > 0) {
            const _errors = {name: 'Tag input is not valid.'};
            throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
        } else {
            return await this.tagRepository.save(newTag);
        }
    }
  
    /*
    * Get all tags
    * @return   All saved tags
    */
    async getAllTags(): Promise<Tag[]>{
        return await this.tagRepository.find();
    }

    /*
    * Get a single tag by the id given
    * @param  tagId
    * @return one tag
    */
    async getTagById(tagId): Promise<Tag>{
        return await this.tagRepository.findOne(tagId);
    }

    /*
    * Delete a tag by the id given
    * @param  tagId
    * @return the DeleteResult
    */
    async deleteTag(tagId): Promise<DeleteResult>{
        return await this.tagRepository.delete(tagId);
    }
}
