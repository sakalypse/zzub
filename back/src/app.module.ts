import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';
import { RoundModule } from './round/round.module';
import { ChoiceModule } from './choice/choice.module';
import { ExtraModule } from './extra/extra.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(),
    UserModule,
    AuthModule,
    CategoryModule,
    TagModule,
    RoundModule,
    ChoiceModule,
    ExtraModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
