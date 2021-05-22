import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from "jsonwebtoken";
import { PackService } from 'src/pack/pack.service';
import { RoundService } from 'src/round/round.service';
import { ChoiceService } from 'src/choice/choice.service';
import { ExtraService } from 'src/extra/extra.service';

@Injectable()
export class GuestGuard implements CanActivate {
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
      if(request.params.id){
        if(decoded.guestId != request.params.id)
          throw new UnauthorizedException();
      }
      return true;
    }
    throw new UnauthorizedException();
  }
}
