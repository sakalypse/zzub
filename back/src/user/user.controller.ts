import { Controller, Post, Res, Body, HttpStatus, Get, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserGuard } from 'src/auth/user.guard';
import { UpdatePackDTO } from 'src/pack/pack.dto';
import { PackService } from 'src/pack/pack.service';
import { UserBodyGuard } from 'src/auth/user-body.guard';
import { AdminGuard } from 'src/auth/admin.guard';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private packService: PackService
    ){}

    @Post('')
    async createUser(@Res() res, @Body() createUserDTO: CreateUserDTO){
        const user = await this.userService.createUser(createUserDTO);
        return res.status(HttpStatus.OK).json(user);
    }

    @UseGuards(AdminGuard)
    @Get('')
    async getAllUsers(@Res() res){
        const users = await this.userService.getAllUsers();
        return res.status(HttpStatus.OK).json(users);
    }
    
    @UseGuards(UserGuard)
    @Get('/:id')
    async getUser(@Res() res, @Param('id') userId){
        const user = await this.userService.getUserById(userId);
        return res.status(HttpStatus.OK).json(user);
    }

    @UseGuards(UserGuard)
    @Put('/:id')
    async updateUser(@Res() res, @Param('id') userId,  @Body() dto: UpdateUserDTO){
        const user = await this.userService.updateUser(userId, dto);
        return res.status(HttpStatus.OK).json(user);
    }

    @UseGuards(UserGuard)
    @Delete('/:id')
    async deleteUser(@Res() res, @Param('id') userId){
        const deleteResult = await this.userService.deleteUser(userId);
        return res.status(HttpStatus.OK).json(deleteResult);
    }

    //Packs of User
    @UseGuards(UserGuard)
    @Get('/:id/pack')
    async getAllPacksOfUser(@Res() res, @Param('id') userId){
        const packs = await this.userService.getAllPacksOfUser(userId);
        return res.status(HttpStatus.OK).json(packs);
    }
    
    @UseGuards(UserGuard)
    @Get('/:id/pack/:packId')
    async getPackOfUser(@Res() res, @Param('id') userId, @Param('packId') packId){
        const pack = await this.userService.getPackOfUser(userId, packId);
        return res.status(HttpStatus.OK).json(pack);
    }

    //Favorites packs of User
    @UseGuards(UserGuard)
    @Get('/:id/favorite')
    async getAllFavoritesPacksOfUser(@Res() res, @Param('id') userId){
        const packs = await this.userService.getAllFavoritesPacksOfUser(userId);
        return res.status(HttpStatus.OK).json(packs);
    }

    //packId called here idPack to pass the guard : here we don't care if the pack is owned by the user
    @UseGuards(UserGuard)
    @Put('/:id/favorite/:idPack')
    async FavoritePackToUser(@Res() res, @Param('id') userId, @Param('idPack') idPack, @Body() dto: any){
        const packs = await this.userService.favoritesPackToUser(userId, idPack);
        return res.status(HttpStatus.OK).json(packs);
    }
    @UseGuards(UserGuard)
    @Delete('/:id/favorite/:idPack')
    async DeleteFavoritePackToUser(@Res() res, @Param('id') userId, @Param('idPack') idPack, @Body() dto: any){
        const packs = await this.userService.deleteFavoritesPackToUser(userId, idPack);
        return res.status(HttpStatus.OK).json(packs);
    }

    /*
    @UseGuards(UserGuard)
    @Put('/:id/pack/:packId')
    async updatePackOfUser( @Res() res, @Param('packId') packId,
                          @Body() dto: UpdatePackDTO){
        const pack = await this.packService.
                     updatePack(packId, dto);
        return res.status(HttpStatus.OK).json(pack);
    }

    @UseGuards(UserGuard)
    @Delete('/:id/pack/:packId')
    async deletePackOfUser(@Res() res, @Param('packId') packId){
        const deleteResult = await this.packService.deletePack(packId);
        return res.status(HttpStatus.OK).json(deleteResult);
    }
    */
}
