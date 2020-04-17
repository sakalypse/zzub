import { Module } from '@nestjs/common';
import { PackService } from './pack.service';
import { PackController } from './pack.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pack } from './pack.entity';
import { Tag } from 'src/tag/tag.entity';
import { User } from 'src/user/user.entity';
import { TagService } from 'src/tag/tag.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pack, User, Tag])
  ],
  providers: [PackService, TagService, UserService],
  controllers: [PackController]
})
export class PackModule {}
