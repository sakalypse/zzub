import {Entity, PrimaryGeneratedColumn,
        Column, ManyToMany, JoinTable, JoinColumn, OneToMany, ManyToOne} from 'typeorm';
import {Length, IsEmail, IsDate} from "class-validator";
import { Category } from 'src/category/category.entity';
import { Choice } from 'src/choice/choice.entity';
import { Extra } from 'src/extra/extra.entity';

@Entity()
export class Round {
    @PrimaryGeneratedColumn()
    roundId: number;

    @ManyToOne(type => Category, category => category.rounds,
                {onDelete:"CASCADE"})
    category: Category;

    @Column({ length: 255})
    question:string;

    @OneToMany(type => Choice, choice => choice.round)
    @JoinColumn()
    choices:Choice[];

    @OneToMany(type => Extra, extra => extra.round)
    @JoinColumn()
    extras:Extra[];
}