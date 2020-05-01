import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Pack } from 'src/pack/pack.entity';
import { Round } from 'src/round/round.entity';
import { PackService } from 'src/pack/pack.service';
import { TagService } from 'src/tag/tag.service';
import { Tag } from 'src/tag/tag.entity';
import { RoundService } from 'src/round/round.service';
import { Choice } from 'src/choice/choice.entity';
import { Extra } from 'src/extra/extra.entity';
import { ChoiceService } from 'src/choice/choice.service';
import { ExtraService } from 'src/extra/extra.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Pack, Round, Tag, Choice, Extra])
    ],
    providers: [UserService, PackService, RoundService, ChoiceService, ExtraService],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule{}
