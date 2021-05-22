import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Pack } from 'src/pack/pack.entity';
import { PackService } from 'src/pack/pack.service';
import { Tag } from 'src/tag/tag.entity';
import { GameGateway } from './game.gateway';
import { GuestService } from 'src/guest/guest.service';
import { Guest } from 'src/guest/guest.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, User, Guest, Pack, Tag]),
  ],
  controllers: [GameController],
  providers: [GameService, UserService, GuestService, PackService, GameGateway]
})
export class GameModule {}
