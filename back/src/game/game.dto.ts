import { User } from "../user/user.entity";
import { Pack } from "../pack/pack.entity";

export class CreateGameDTO{
    readonly owner:number;
    readonly pack:Pack[];
}