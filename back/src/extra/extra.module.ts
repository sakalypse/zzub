import { Module } from '@nestjs/common';
import { ExtraService } from './extra.service';
import { ExtraController } from './extra.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Extra } from './extra.entity';
import { PackService } from 'src/pack/pack.service';
import { RoundService } from 'src/round/round.service';
import { Pack } from 'src/pack/pack.entity';
import { Tag } from 'src/tag/tag.entity';
import { User } from 'src/user/user.entity';
import { Round } from 'src/round/round.entity';
import { Choice } from 'src/choice/choice.entity';
import { ChoiceService } from 'src/choice/choice.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Extra, Pack, Tag, User, Round, Choice])
  ],
  exports: [ExtraService],
  providers: [ExtraService, PackService, RoundService, ChoiceService],
  controllers: [ExtraController]
})
export class ExtraModule {}
