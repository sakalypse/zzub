import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from "jsonwebtoken";
import { PackService } from 'src/pack/pack.service';
import { RoundService } from 'src/round/round.service';

@Injectable()
export class UserBodyGuard implements CanActivate {
  constructor(
    private packService: PackService,
    private roundService: RoundService){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    const authHeaders: any = request.headers.authorization;

    if (authHeaders &&
      authHeaders.startsWith('Bearer')) {
      const token = (authHeaders as string).split(' ')[1];
      const secret = process.env.JWTSECRET;
      const decoded: any = await jwt.verify(token, secret);
      //check author inside body
      if(request.body.author && decoded.userId != request.body.author)
        throw new UnauthorizedException();
      //check pack inside body -> if author of pack == userId from token
      if(request.body.pack){
        const pack = await this.packService.getPackById(request.body.pack);
        if(decoded.userId != pack.author.userId)
          throw new UnauthorizedException();
      }
      //check round inside body
      if(request.body.round){
        const round = await this.roundService.getRoundById(request.body.round);
        const pack = await this.packService.getPackById(round.pack);
        if(decoded.userId != pack.author.userId)
          throw new UnauthorizedException();
      }
      return true;
    }
    throw new UnauthorizedException();
  }
}
