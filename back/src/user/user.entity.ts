import {Entity, PrimaryGeneratedColumn,
        Column, Unique, OneToMany, JoinColumn, ManyToMany, JoinTable, ManyToOne, OneToOne} from 'typeorm';
import {Length, IsEmail, IsDate} from "class-validator";
import { Pack } from 'src/pack/pack.entity';
import { Game } from 'src/game/game.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ length: 25})
    username:string;

    @Column()
    email:string;

    @Column() 
    password:string;

    @Column() 
    role:number;

    @OneToMany(type => Pack, pack => pack.author)
    @JoinColumn()
    packs:Pack[];

    @ManyToMany(type => Pack, pack => pack.packId, { cascade: true })
    @JoinTable()
    favorites:Pack[];

    @ManyToOne(type => Game, { cascade: true })
    game: Game;
    @JoinColumn()
    @OneToOne(type => Game, { cascade: true })
    hostGame: Game;
}