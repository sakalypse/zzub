import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult, In } from 'typeorm';
import { Category } from './category.entity';
import { Tag } from 'src/tag/tag.entity';
import { CreateCategoryDTO, UpdateCategoryDTO } from './category.dto';
import { validate } from 'class-validator';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepository : Repository<Category>,
        @InjectRepository(Tag)
        private tagRepository : Repository<Tag>
    ) {}

    /*
    * Create a new Category with the data received
    * @param  dto : Contains category's data
    * @return       the saved category
    */
    async createCategory(dto: CreateCategoryDTO): Promise<Category>{
        const { name, author, tags } = dto;

        // check uniqueness of name
        const categorySearched = await this.categoryRepository.
                    findOne({ name: name });
        if (categorySearched) {
            const errors = {name: 'Name already taken.'};
            throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
        }

        // create new category
        let newCategory = new Category();
        newCategory.name = name;
        newCategory.author = author;
        newCategory.rounds = [];

        if(tags!=null){
            newCategory.tags = [];
            await this.tagRepository.find({tagId: In(tags)}).
            then(tagsFound => {
                for(const tag of tagsFound){
                    newCategory.tags.push(tag);
                }
            })
        }
        else   
            newCategory.tags = [];

        const errors = await validate(newCategory);
        if (errors.length > 0) {
            const _errors = {name: 'Category input is not valid.'};
            throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
        } else {
            return await this.categoryRepository.save(newCategory);
        }
    }
  
    /*
    * Get all categories
    * @return   All saved categories
    */
    async getAllCategories(): Promise<Category[]>{
        return await this.categoryRepository.find({relations: ["author", "tags"]});
    }

    /*
    * Get a single category by the id given
    * @param  categoryId
    * @return one category
    */
    async getCategoryById(categoryId): Promise<Category>{
        return await this.categoryRepository.findOne(categoryId, {relations: ["author", "tags"]});
    }

    /*
    * Get a single category by the name given
    * @param  name
    * @return one category
    */
    async getCategoryByName(name): Promise<Category>{
        return await this.categoryRepository.findOne({name: name}, {relations: ["author", "tags"]});
    }

    /*
    * Update a category by the id and dto given
    * @param  categoryId
    * @param  dto : data to update
    * @return the category updated
    */
    async updateCategory(categoryId, dto: UpdateCategoryDTO): Promise<Category>{
        let categoryToUpdate = await this.categoryRepository.findOne(categoryId);
        
        categoryToUpdate.name = dto.name;
        if(dto.tags!=null){
            categoryToUpdate.tags = [];
            await this.tagRepository.find({tagId: In(dto.tags)}).
            then(tagsFound => {
                for(const tag of tagsFound){
                    categoryToUpdate.tags.push(tag);
                }
            })
        }

        return await this.categoryRepository.save(categoryToUpdate);
    }

    /*
    * Delete a category by the id given
    * @param  categoryId
    * @return the DeleteResult
    */
    async deleteCategory(categoryId): Promise<DeleteResult>{
        return await this.categoryRepository.delete(categoryId);
    }
}
