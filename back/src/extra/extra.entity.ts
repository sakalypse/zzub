import {Entity, PrimaryGeneratedColumn,
        Column, ManyToMany, JoinTable, JoinColumn, OneToMany, ManyToOne, OneToOne} from 'typeorm';
import {Length, IsEmail, IsDate} from "class-validator";
import { Round } from 'src/round/round.entity';

@Entity()
export class Extra {
    @PrimaryGeneratedColumn()
    extraId: number;

    @OneToOne(type => Round, round => round.extra,
                {cascade:true})
    round: Round;

    @Column({nullable:false})
    extraType:number;

    @Column({ length: 255})
    url:string;
}