import { Pack } from "src/pack/pack.entity";
import { Game } from "src/game/game.entity";

export class CreateUserDTO{
    readonly username:string;
    readonly email:string;
    readonly password:string;
}

export class UpdateUserDTO{
    readonly username:string;
    readonly email:string;
    readonly game:Game;
    readonly hostGame:Game;
}

export class ReturnedUserDTO{
    readonly userId:number;
    readonly username:string;
    readonly email:string;
    readonly packs:Pack[];
    readonly favorites:Pack[];
}