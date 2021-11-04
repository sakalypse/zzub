import { Module } from '@nestjs/common';
import { RoundService } from './round.service';
import { RoundController } from './round.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Round } from './round.entity';
import { PackService } from 'src/pack/pack.service';
import { Pack } from 'src/pack/pack.entity';
import { Tag } from 'src/tag/tag.entity';
import { User } from 'src/user/user.entity';
import { ChoiceService } from 'src/choice/choice.service';
import { ExtraService } from 'src/extra/extra.service';
import { Choice } from 'src/choice/choice.entity';
import { Extra } from 'src/extra/extra.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Round, Pack, Tag, User, Choice, Extra])
  ],
  providers: [RoundService, PackService, ChoiceService, ExtraService],
  controllers: [RoundController]
})
export class RoundModule {}
