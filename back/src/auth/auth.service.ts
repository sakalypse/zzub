import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs";
import { CreateGuestDTO } from 'src/user/user.dto';
import { Role } from 'src/shared/role.enum';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.getUserByUsernameForAuth(username);
        let passMatch = bcrypt.compareSync(password, user.password);
        if (user && passMatch) {
          const { password, ...result } = user;
          return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { userId: user.userId, username: user.username, role: user.role };
        return {
          access_token: this.jwtService.sign(payload),
        };
    }

    async registerGuest(guestInput: any) {
      let createGuestDTO = new CreateGuestDTO();
      createGuestDTO.username = guestInput.username;
      createGuestDTO.game = guestInput.game;
      //Creer guest
      let guest = await this.userService.createGuest(createGuestDTO);

      const payload = { userId: guest.userId, username: guest.username, role: Role.guest };
      return {
        access_token: this.jwtService.sign(payload),
      };
  }
}
