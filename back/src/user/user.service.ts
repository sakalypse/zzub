import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO, ReturnedUserDTO } from './user.dto';
import * as bcrypt from "bcryptjs";
import { validate } from 'class-validator';
import { Pack } from 'src/pack/pack.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>,
        @InjectRepository(Pack)
        private packRepository : Repository<Pack>
    ) {}

    /*
    * Create a new User with the data received
    * @param  dto : Contains user's data
    * @return       the saved user
    */
    async createUser(dto: CreateUserDTO): Promise<ReturnedUserDTO>{
        let { username, email, password } = dto;
        username = username.toLowerCase();
        email = email.toLowerCase();
        // check uniqueness of username/email
        const userSearched = await this.userRepository.
                    findOne({ username: username, email: email });
        if (userSearched) {
            const errors = {username: 'Username and/or email already taken.'};
            throw new HttpException({message: 'Input data validation failed', errors}, HttpStatus.BAD_REQUEST);
        }

        // create new user
        let newUser = new User();
        newUser.username = username;
        newUser.email = email;
        newUser.password = bcrypt.hashSync(password, 10);

        const errors = await validate(newUser);
        if (errors.length > 0) {
            const _errors = {username: 'User input is not valid.'};
            throw new HttpException({message: 'Input data validation failed', _errors}, HttpStatus.BAD_REQUEST);
        } else {
            const savedUser = await this.userRepository.save(newUser);
            const { password, ...result } = savedUser;
            return result;
        }
    }
  
    /*
    * Get all users
    * @return   All saved users
    */
    async getAllUsers(): Promise<ReturnedUserDTO[]>{
        const users = await this.userRepository.find();
        let returnedUsers = [];
        users.forEach(user => {
            const { password, ...result } = user;
            returnedUsers.push(result);
        });
        return returnedUsers;
    }

    /*
    * Get a single user by the id given
    * @param  userId
    * @return one user
    */
    async getUserById(userId): Promise<ReturnedUserDTO>{
        const user = await this.userRepository.findOne(userId);
        const { password, ...result } = user;
        return result;
    }

    /*
    * Get a single user by the id given
    * @param  userId
    * @return one user
    */
    async getUserByUsername(username): Promise<ReturnedUserDTO>{
        const user = await this.userRepository.findOne({username: username});
        const { password, ...result } = user;
        return result;
    }

    /*
    * Get a single user by the id given for authentification -> keep hashed password
    * @param  userId
    * @return one user
    */
   async getUserByUsernameForAuth(username): Promise<User>{
    return await this.userRepository.findOne({username: username});
}

    /*
    * Update a user by the id and dto given
    * @param  userId
    * @param  dto : data to update
    * @return the user updated
    */
    async updateUser(userId, dto): Promise<ReturnedUserDTO>{
        let userToUpdate = await this.userRepository.findOne(userId);
        
        userToUpdate.username = dto.username;
        userToUpdate.email = dto.email;
        userToUpdate.password = dto.password;

        const user = await this.userRepository.save(userToUpdate);
        const { password, ...result } = user;
        return result;
    }

    /*
    * Delete a user by the id given
    * @param  userId
    * @return the DeleteResult
    */
    async deleteUser(userId): Promise<DeleteResult>{
        return await this.userRepository.delete(userId);
    }


    /*
    * Get all packs of a user
    * @param  userId
    * @return All saved packs of user
    */
    async getPacksOfUser(userId): Promise<Pack[]>{
        const packs = await this.packRepository.find({
            relations: ["author", "rounds"],
            where:{author:{userId: userId}}});
        
        //remove hashed password from returned data
        packs.forEach(pack => {
            pack.author.password = "";
        });

        return packs;
    }

    /*
    * Get single pack of a user
    * @param  userId
    * @param  packId
    * @return saved pack of user
    */
    async getPackOfUser(userId, packId): Promise<Pack>{
        const pack = await this.packRepository.findOne({
        relations: ["author", "rounds",
                    "rounds.choices", "rounds.extras"],
        where:{author:{userId: userId}, packId}});

        //remove hashed password from returned data
        if(pack){
            pack.author.password = "";
            return pack;
        }
        else   
            return null;
    }
}
