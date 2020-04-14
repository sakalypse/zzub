import { User } from "src/user/user.entity";
import { Tag } from "src/tag/tag.entity";

export class CreatePackDTO{
    readonly name:string;
    readonly author:User;
    readonly tag:Tag;
}

export class UpdatePackDTO{
    readonly name:string;
    readonly tag:Tag;
}