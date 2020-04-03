import {Length, IsEmail, IsDate} from "class-validator";
import {Entity, PrimaryGeneratedColumn,
        Column, Unique} from 'typeorm';

@Entity()
@Unique(["username"])
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn()
    userId: string;

    @Column({ length: 25})
    username:string;

    @Column()
    email:string;

    @Column() 
    password:string;
}