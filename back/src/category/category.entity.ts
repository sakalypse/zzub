import {Entity, PrimaryGeneratedColumn,
        Column, Unique, ManyToMany, JoinTable, JoinColumn, OneToMany, ManyToOne} from 'typeorm';
import {Length, IsEmail, IsDate} from "class-validator";
import { Tag } from 'src/tag/tag.entity';
import { Round } from 'src/round/round.entity';
import { User } from 'src/user/user.entity';

@Entity()
@Unique(["name"])
export class Category {
    @PrimaryGeneratedColumn()
    categoryId: number;

    @ManyToOne(type => User, user => user.categories,
        {onDelete:"CASCADE"})
    author: User;

    @Column({ length: 25 })
    name:string;

    @ManyToMany(type => Tag)
    @JoinTable({
        name: 'tag_of_category',
        joinColumn: { name: 'categoryId', referencedColumnName: 'categoryId'},
        inverseJoinColumn: { name: 'tagId', referencedColumnName: 'tagId'},
    })
    tags:Tag[];

    @OneToMany(type => Round, round => round.category)
    @JoinColumn()
    rounds:Round[];
}