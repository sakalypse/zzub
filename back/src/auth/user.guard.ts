import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from "jsonwebtoken";
import { PackService } from 'src/pack/pack.service';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private packService: PackService){}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    const authHeaders: any = request.headers.authorization;

    if (authHeaders &&
      authHeaders.startsWith('Bearer')) {
      const token = (authHeaders as string).split(' ')[1];
      const secret = process.env.JWTSECRET;
      const decoded: any = await jwt.verify(token, secret);
      //check user ID with params
      if(decoded.userId != request.params.id)
        throw new UnauthorizedException();
      //check userId from author of Pack
      if(request.params.packId){
        const pack = await this.packService.getPackById(request.params.packId);
        if(decoded.userId != pack.author.userId)
          throw new UnauthorizedException();
      }
      return true;
    }
    throw new UnauthorizedException();
  }
}
