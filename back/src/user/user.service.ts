import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './user.dto';
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
    async createUser(dto: CreateUserDTO): Promise<User>{
        const { username, email, password } = dto;

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
            return savedUser;
        }
    }
  
    /*
    * Get all users
    * @return   All saved users
    */
    async getAllUsers(): Promise<User[]>{
        return await this.userRepository.find();
    }

    /*
    * Get a single user by the id given
    * @param  userId
    * @return one user
    */
    async getUserById(userId): Promise<User>{
        return await this.userRepository.findOne(userId);
    }

    /*
    * Get a single user by the id given
    * @param  userId
    * @return one user
    */
    async getUserByUsername(username): Promise<User>{
        return await this.userRepository.findOne({username: username});
    }

    /*
    * Update a user by the id and dto given
    * @param  userId
    * @param  dto : data to update
    * @return the user updated
    */
    async updateUser(userId, dto): Promise<User>{
        let userToUpdate = await this.userRepository.findOne(userId);
        
        userToUpdate.username = dto.username;
        userToUpdate.email = dto.email;
        userToUpdate.password = dto.password;

        return await this.userRepository.save(userToUpdate);
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
        return await this.packRepository.find({
            relations: ["author", "rounds"],
            where:{author:{userId: userId}}});
    }
}
