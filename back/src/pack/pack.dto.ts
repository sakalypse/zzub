import { User } from "src/user/user.entity";
import { Tag } from "src/tag/tag.entity";

export class CreatePackDTO{
    readonly name:string;
    readonly author:User;
    readonly tags:Tag[];
}

export class UpdatePackDTO{
    readonly name:string;
    readonly tags:Tag[];
}