import { Controller, Post, Res, Body, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './user.dto';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Post('/create')
    async createUser(@Res() res, @Body() createUserDTO: CreateUserDTO){
        const user = await this.userService.createUser(createUserDTO);
        return res.status(HttpStatus.OK).json(user);
    }
}
