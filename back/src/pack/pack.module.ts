import { Module } from '@nestjs/common';
import { PackService } from './pack.service';
import { PackController } from './pack.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pack } from './pack.entity';
import { Tag } from 'src/tag/tag.entity';
import { User } from 'src/user/user.entity';
import { TagService } from 'src/tag/tag.service';
import { UserService } from 'src/user/user.service';
import { RoundService } from 'src/round/round.service';
import { Round } from 'src/round/round.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pack, User, Tag, Round])
  ],
  providers: [PackService, TagService, UserService, RoundService],
  controllers: [PackController]
})
export class PackModule {}
