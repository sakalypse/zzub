import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from "jsonwebtoken";
import { Role } from 'src/shared/role.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: any = context.switchToHttp().getRequest();
    const authHeaders: any = request.headers.authorization;

    if (authHeaders &&
      authHeaders.startsWith('Bearer')) {
      const token = (authHeaders as string).split(' ')[1];
      const secret = process.env.JWTSECRET;
      const decoded: any = await jwt.verify(token, secret);
      //check role is admin
      if(decoded.role == Role.admin)
        return true;
    }
    throw new UnauthorizedException();
  }
}
