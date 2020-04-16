import { Injectable, NestMiddleware, HttpException, HttpStatus } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { Request, Response,NextFunction } from "express";
import { ExtractJwt } from "passport-jwt";
import { JwtService } from '@nestjs/jwt';
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
      private readonly userService: UserService,
      private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
        const token = (authHeaders as string).split(' ')[1];
        const secret = process.env.JWTSECRET;
        try{
            await jwt.verify(token, secret);
            next();
        }catch (err) {
            throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }
    throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
  }
}