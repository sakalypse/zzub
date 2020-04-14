import {Entity, PrimaryGeneratedColumn,
        Column, Unique, OneToMany, JoinColumn} from 'typeorm';
import {Length, IsEmail, IsDate} from "class-validator";
import { Pack } from 'src/pack/pack.entity';

@Entity()
@Unique(["username"])
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ length: 25})
    username:string;

    @Column()
    email:string;

    @Column() 
    password:string;

    @OneToMany(type => Pack, pack => pack.author)
    @JoinColumn()
    packs:Pack[];
}