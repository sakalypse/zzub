import {Entity, PrimaryGeneratedColumn,
        Column, Unique} from 'typeorm';
import {Length, IsEmail, IsDate} from "class-validator";

@Entity()
@Unique(["name"])
export class Tag {
    @PrimaryGeneratedColumn()
    tagId: number;

    @Column({ length: 25})
    name:string;
}