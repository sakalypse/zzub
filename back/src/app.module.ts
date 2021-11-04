import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PackModule } from './pack/pack.module';
import { TagModule } from './tag/tag.module';
import { RoundModule } from './round/round.module';
import { ChoiceModule } from './choice/choice.module';
import { ExtraModule } from './extra/extra.module';
import { UserService } from './user/user.service';
import { TagService } from './tag/tag.service';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    PackModule,
    TagModule,
    RoundModule,
    ChoiceModule,
    ExtraModule,
    GameModule,
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private userService: UserService,
    private tagService: TagService) {}
  onModuleInit() {
    this.userService.createAdmin(
      process.env.ADMINUSERNAME,
      process.env.ADMINEMAIL,
      process.env.ADMINPASSWORD);
    this.tagService.initDefaultTags();
  }
}
