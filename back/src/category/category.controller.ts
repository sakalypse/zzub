import { Controller, Post, Res, Body, HttpStatus, Get,
         Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDTO, UpdateCategoryDTO } from './category.dto';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService
    ){}

    @Post('')
    async createCategory(@Res() res,
                         @Body() createCategoryDTO: CreateCategoryDTO){
        const category = await this.categoryService.
                         createCategory(createCategoryDTO);
        return res.status(HttpStatus.OK).json(category);
    }

    @Get('')
    async getAllCategories(@Res() res){
        const categories = await this.categoryService.getAllCategories();
        return res.status(HttpStatus.OK).json(categories);
    }
    
    @Get('/:id')
    async getCategory(@Res() res, @Param('id') categoryId){
        const category = await this.categoryService.getCategoryById(categoryId);
        return res.status(HttpStatus.OK).json(category);
    }

    @Put('/:id')
    async updateCategory( @Res() res, @Param('id') categoryId,
                          @Body() dto: UpdateCategoryDTO){
        const category = await this.categoryService.
                     updateCategory(categoryId, dto);
        return res.status(HttpStatus.OK).json(category);
    }

    @Delete('/:id')
    async deleteCategory(@Res() res, @Param('id') categoryId){
        const deleteResult = await this.categoryService.deleteCategory(categoryId);
        return res.status(HttpStatus.OK).json(deleteResult);
    }
}
