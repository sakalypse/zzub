import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Pack } from 'src/pack/pack.entity';
import { Round } from 'src/round/round.entity';
import { UserMiddleware } from 'src/middleware/user.middleware';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Pack, Round])
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(UserMiddleware)
        .forRoutes('user/:id/pack');
    }
  }
