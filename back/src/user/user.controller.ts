import { Controller, Post, Res, Body, HttpStatus, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Post('')
    async createUser(@Res() res, @Body() createUserDTO: CreateUserDTO){
        const user = await this.userService.createUser(createUserDTO);
        return res.status(HttpStatus.OK).json(user);
    }

    @Get('')
    async getAllUsers(@Res() res){
        const users = await this.userService.getAllUsers();
        return res.status(HttpStatus.OK).json(users);
    }
    
    @Get('/:id')
    async getUser(@Res() res, @Param('id') userId){
        const user = await this.userService.getUserById(userId);
        return res.status(HttpStatus.OK).json(user);
    }

    @Put('/:id')
    async updateUser(@Res() res, @Param('id') userId,  @Body() dto: UpdateUserDTO){
        const user = await this.userService.updateUser(userId, dto);
        return res.status(HttpStatus.OK).json(user);
    }

    @Delete('/:id')
    async deleteUser(@Res() res, @Param('id') userId){
        const deleteResult = await this.userService.deleteUser(userId);
        return res.status(HttpStatus.OK).json(deleteResult);
    }

    @Get('/:id/pack')
    async getPacksOfUser(@Res() res, @Param('id') userId){
        const packs = await this.userService.getPacksOfUser(userId);
        return res.status(HttpStatus.OK).json(packs);
    }
}
