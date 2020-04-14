import {Entity, PrimaryGeneratedColumn,
        Column, Unique, ManyToMany, JoinTable, JoinColumn, OneToMany, ManyToOne} from 'typeorm';
import {Length, IsEmail, IsDate} from "class-validator";
import { Tag } from 'src/tag/tag.entity';
import { Round } from 'src/round/round.entity';
import { User } from 'src/user/user.entity';

@Entity()
@Unique(["name"])
export class Pack {
    @PrimaryGeneratedColumn()
    packId: number;

    @ManyToOne(type => User, user => user.packs,
        {onDelete:"CASCADE"})
    author: User;

    @Column({ length: 25 })
    name:string;

    @Column()
    isPublic:boolean;
    
    @ManyToOne(type => Tag, tag => tag.packs,
        {onDelete:"CASCADE"})
    @JoinColumn()
    tag:Tag;

    @OneToMany(type => Round, round => round.pack)
    @JoinColumn()
    rounds:Round[];
}