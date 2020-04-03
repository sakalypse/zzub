import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './user.dto';
import * as bcrypt from "bcryptjs";
import { validate } from 'class-validator';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository : Repository<User>
    ) {}

    /*
    * Create a new User with the data received
    * @param  dto   Contains user's data
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
}
