import { User } from "../user/user.entity";
import { Pack } from "../pack/pack.entity";

export class CreateGameDTO{
    readonly pack:Pack[];
    readonly owner:User;
}