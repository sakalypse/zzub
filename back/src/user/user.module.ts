import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Pack } from 'src/pack/pack.entity';
import { Round } from 'src/round/round.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Pack, Round])
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule {}
