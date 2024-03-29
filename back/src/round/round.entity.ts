import {Entity, PrimaryGeneratedColumn,
        Column, ManyToMany, JoinTable, JoinColumn, OneToMany, ManyToOne, OneToOne} from 'typeorm';
import {Length, IsEmail, IsDate} from "class-validator";
import { Pack } from 'src/pack/pack.entity';
import { Choice } from 'src/choice/choice.entity';
import { Extra } from 'src/extra/extra.entity';

@Entity()
export class Round {
    @PrimaryGeneratedColumn()
    roundId: number;

    @ManyToOne(type => Pack, pack => pack.rounds,
                {onDelete:"CASCADE"})
    pack: Pack;

    @Column({ length: 255})
    question:string;

    @Column()
    isMultipleChoice:boolean;

    @OneToMany(type => Choice, choice => choice.round)
    @JoinColumn()
    choices:Choice[];

    @OneToOne(type => Extra, extra => extra.round, {
        cascade: ['update']
      })
    @JoinColumn()
    extra:Extra;
}