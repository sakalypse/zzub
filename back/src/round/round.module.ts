import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { RoundController } from './round.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './round.entity';
import { PackService } from 'src/pack/pack.service';
import { Pack } from 'src/pack/pack.entity';
import { Tag } from 'src/tag/tag.entity';
import { User } from 'src/user/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Round, Pack, Tag, User])
  ],
  providers: [RoundService, PackService],
  controllers: [RoundController]
})
export class RoundModule {}
