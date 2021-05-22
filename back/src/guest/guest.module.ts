import { Module } from '@nestjs/common';
import { GuestController } from './guest.controller';
import { GuestService } from './guest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { Guest } from './guest.entity';
import { Game } from 'src/game/game.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Guest, User, Game])
  ],
  controllers: [GuestController],
  providers: [GuestService]
})
export class GuestModule {}
