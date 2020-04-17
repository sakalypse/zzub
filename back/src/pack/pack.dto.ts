import { User } from "src/user/user.entity";
import { Tag } from "src/tag/tag.entity";

export class CreatePackDTO{
    readonly author:User;
}

export class UpdatePackDTO{
    readonly name:string;
    readonly tag:Tag;
    readonly isPublic:boolean;
}