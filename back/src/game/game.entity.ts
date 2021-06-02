import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, ManyToOne, OneToOne, JoinTable, ManyToMany } from 'typeorm';
import { Pack } from '../pack/pack.entity';
import { User } from '../user/user.entity';

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    gameId: number;
    
    @JoinTable()
    @ManyToMany(type => Pack, pack => pack.packId, { cascade: true })
    pack:Pack[];

    @JoinColumn()
    @OneToMany(type=>User, player=>player.game)
    players: User[];
    
    @JoinColumn()
    @OneToOne(type=>User, owner=>owner.hostGame)
    owner: User;

    @Column({nullable:true})
    dateCreation: Date;

    @Column({nullable:false})
    code: String;

    @Column({nullable:false})
    isStarted: boolean;
}