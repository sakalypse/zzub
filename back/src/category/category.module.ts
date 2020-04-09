import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Tag } from 'src/tag/tag.entity';
import { User } from 'src/user/user.entity';
import { TagService } from 'src/tag/tag.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, User, Tag])
  ],
  providers: [CategoryService, TagService],
  controllers: [CategoryController]
})
export class CategoryModule {}
