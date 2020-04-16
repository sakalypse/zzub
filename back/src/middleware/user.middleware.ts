import { Injectable, NestMiddleware, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response,NextFunction } from "express";
import * as jwt from "jsonwebtoken";

@Injectable()
export class UserMiddleware implements NestMiddleware {
  constructor() {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization;
    if (authHeaders &&
        authHeaders.startsWith('Bearer')) {
        const token = (authHeaders as string).split(' ')[1];
        const secret = process.env.JWTSECRET;
        const decoded: any = await jwt.verify(token, secret);
        if(decoded.userId == req.params.id){
            next();
        }else{
          throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
        }
    }else{
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED);
    }
  }
}