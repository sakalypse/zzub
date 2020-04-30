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

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Pack, Round, Tag])
    ],
    providers: [UserService, PackService, RoundService],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule{}
