import { Controller, Post, Res, Body, HttpStatus, Get,
         Param, Put, Delete, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDTO } from './tag.dto';
import { AdminGuard } from 'src/auth/admin.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tag')
export class TagController {
    constructor(
        private tagService: TagService
    ){}

    @UseGuards(AdminGuard)
    @Post('')
    async createTag(@Res() res,
                         @Body() createTagDTO: CreateTagDTO){
        const tag = await this.tagService.
                         createTag(createTagDTO);
        return res.status(HttpStatus.OK).json(tag);
    }

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getAllTags(@Res() res){
        const tags = await this.tagService.getAllTags();
        return res.status(HttpStatus.OK).json(tags);
    }
    
    @UseGuards(JwtAuthGuard)
    @Get('/:id')
    async getTag(@Res() res, @Param('id') tagId){
        const tag = await this.tagService.getTagById(tagId);
        return res.status(HttpStatus.OK).json(tag);
    }
    
    @UseGuards(AdminGuard)
    @Delete('/:id')
    async deleteTag(@Res() res, @Param('id') tagId){
        const deleteResult = await this.tagService.deleteTag(tagId);
        return res.status(HttpStatus.OK).json(deleteResult);
    }
}
