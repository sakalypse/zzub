import { Module } from '@nestjs/common';
import { ChoiceService } from './choice.service';
import { ChoiceController } from './choice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Choice } from './choice.entity';
import { PackService } from 'src/pack/pack.service';
import { Pack } from 'src/pack/pack.entity';
import { Tag } from 'src/tag/tag.entity';
import { User } from 'src/user/user.entity';
import { RoundService } from 'src/round/round.service';
import { Round } from 'src/round/round.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Choice, Pack, Tag, User, Round])
  ],
  providers: [ChoiceService, PackService, RoundService],
  controllers: [ChoiceController]
})
export class ChoiceModule {}
