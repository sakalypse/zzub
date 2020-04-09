import {Entity, PrimaryGeneratedColumn,
        Column, ManyToMany, JoinTable, JoinColumn, OneToMany, ManyToOne} from 'typeorm';
import {Length, IsEmail, IsDate} from "class-validator";
import { Round } from 'src/round/round.entity';

@Entity()
export class Extra {
    @PrimaryGeneratedColumn()
    extraId: number;

    @ManyToOne(type => Round, round => round.extras,
                {onDelete:"CASCADE"})
    round: Round;

    @Column({ length: 255})
    url:string;
}