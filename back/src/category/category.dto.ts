import { User } from "src/user/user.entity";
import { Tag } from "src/tag/tag.entity";

export class CreateCategoryDTO{
    readonly name:string;
    readonly author:User;
    readonly tags:Tag[];
}

export class UpdateCategoryDTO{
    readonly name:string;
    readonly tags:Tag[];
}