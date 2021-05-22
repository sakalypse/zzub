import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { GuestModule } from 'src/guest/guest.module';
import { GuestService } from 'src/guest/guest.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from 'src/guest/guest.entity';
import { User } from 'src/user/user.entity';
require('dotenv').config();
@Module({
  imports: [
    TypeOrmModule.forFeature([Guest, User]),
    UserModule,
    GuestModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWTSECRET,
      signOptions: { expiresIn: 3600 },
    })
  ],
  providers: [AuthService, GuestService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
