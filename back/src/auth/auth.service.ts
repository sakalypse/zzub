import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.getUserByUsername(username);
        let passMatch = bcrypt.compareSync(password, user.password);
        if (user && passMatch) {
          const { password, ...result } = user;
          return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.userId };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }
}
