import {Entity, PrimaryGeneratedColumn,
        Column, ManyToOne} from 'typeorm';
import {Length, IsEmail, IsDate} from "class-validator";
import { Round } from 'src/round/round.entity';

@Entity()
export class Choice {
    @PrimaryGeneratedColumn()
    choiceId: number;

    @ManyToOne(type => Round, round => round.choices,
                {onDelete:"CASCADE"})
    round: Round;

    @Column({ length: 255})
    choice:string;
}