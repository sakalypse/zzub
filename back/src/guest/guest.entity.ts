import {Entity, PrimaryGeneratedColumn,
    Column, OneToMany, JoinColumn, ManyToMany, JoinTable, ManyToOne, OneToOne} from 'typeorm';
import {Length, IsEmail, IsDate} from "class-validator";
import { Pack } from 'src/pack/pack.entity';
import { Game } from 'src/game/game.entity';

@Entity()
export class Guest {
@PrimaryGeneratedColumn()
guestId: number;

@Column({ length: 25})
username:string;

@ManyToOne(type => Game, { cascade: true })
game: Game;
}