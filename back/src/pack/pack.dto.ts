import { User } from "src/user/user.entity";
import { Tag } from "src/tag/tag.entity";

export enum Language {
    english = 0,
    france = 1,
    deutsch = 2,
    spanish = 3
}

export class CreatePackDTO{
    readonly author:User;
}

export class UpdatePackDTO{
    readonly name:string;
    readonly tag:Tag;
    readonly isPublic:boolean;
    readonly language:number;
} 