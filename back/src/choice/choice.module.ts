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
import { ExtraService } from 'src/extra/extra.service';
import { Extra } from 'src/extra/extra.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Choice, Pack, Tag, User, Round, Extra])
  ],
  exports: [ChoiceService],
  providers: [ChoiceService, PackService, RoundService, ExtraService],
  controllers: [ChoiceController]
})
export class ChoiceModule {}
