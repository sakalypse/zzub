import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from "jsonwebtoken";
import { PackService } from 'src/pack/pack.service';
import { RoundService } from 'src/round/round.service';
import { ChoiceService } from 'src/choice/choice.service';
import { ExtraService } from 'src/extra/extra.service';
import { Console } from 'console';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private packService: PackService,
    private roundService: RoundService,
    private choiceService: ChoiceService,
    private extraService: ExtraService){}
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
        if(decoded.userId != request.params.id)
          throw new UnauthorizedException();
      }
      //check userId from author of Pack
      if(request.params.packId){
        const pack = await this.packService.getPackById(request.params.packId);
        if(decoded.userId != pack.author.userId)
          throw new UnauthorizedException();
      }
      //check userId from author of Pack of a round
      if(request.params.roundId){
        const round = await this.roundService.getRoundById(request.params.roundId);
        const roundPack = await this.packService.getPackById(round.pack.packId);
        if(decoded.userId != roundPack.author.userId)
          throw new UnauthorizedException();
      }
      //check userId from choice
      if(request.params.choiceId){
        const choice = await this.choiceService.getChoiceById(request.params.choiceId);
        const round = await this.roundService.getRoundById(choice.round.roundId);
        const roundPack = await this.packService.getPackById(round.pack.packId);
        if(decoded.userId != roundPack.author.userId)
          throw new UnauthorizedException();
      }
      //check userId from extra
      if(request.params.extraId){
        const extra = await this.extraService.getExtraById(request.params.extraId);
        const round = await this.roundService.getRoundById(extra.round.roundId);
        const roundPack = await this.packService.getPackById(round.pack.packId);
        if(decoded.userId != roundPack.author.userId)
          throw new UnauthorizedException();
      }
      return true;
    }
    throw new UnauthorizedException();
  }
}
