import { Game } from "src/game/game.entity";

export class CreateGuestDTO{
    username:string;
    game:Game;
}

export class ReturnedGuestDTO{
    readonly guestId:number;
    readonly username:string;
    readonly game:Game;
}