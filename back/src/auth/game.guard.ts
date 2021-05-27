import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from "jsonwebtoken";
import { GameService } from 'src/game/game.service';

@Injectable()
export class GameGuard implements CanActivate {
  constructor(){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    const authHeaders: any = request.headers.authorization;

    if (authHeaders &&
      authHeaders.startsWith('Bearer')) {
      const token = (authHeaders as string).split(' ')[1];
      const secret = process.env.JWTSECRET;
      const decoded: any = await jwt.verify(token, secret);
      //check user ID with params
      if(request.params.userId){
        if(decoded.userId != request.params.userId)
          throw new UnauthorizedException();
      }
      return true;
    }
    throw new UnauthorizedException();
  }
}
