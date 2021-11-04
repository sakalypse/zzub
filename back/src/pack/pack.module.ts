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
import { ChoiceService } from 'src/choice/choice.service';
import { ExtraService } from 'src/extra/extra.service';
import { Choice } from 'src/choice/choice.entity';
import { Extra } from 'src/extra/extra.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pack, User, Tag, Round, Choice, Extra])
  ],
  providers: [PackService, TagService, UserService, RoundService, ChoiceService, ExtraService],
  controllers: [PackController]
})
export class PackModule {}
