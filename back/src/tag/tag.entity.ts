import {Entity, PrimaryGeneratedColumn,
        Column, Unique, JoinColumn, OneToMany} from 'typeorm';
import {Length, IsEmail, IsDate} from "class-validator";
import { Pack } from 'src/pack/pack.entity';

@Entity()
@Unique(["name"])
export class Tag {
    @PrimaryGeneratedColumn()
    tagId: number;

    @Column({ length: 25})
    name:string;

    @OneToMany(type => Pack, pack => pack.tag)
    packs:Pack[];
}