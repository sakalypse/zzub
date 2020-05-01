import { Round } from "src/round/round.entity";

export enum ExtraType {
    noExtra = 0,
    audio = 1,
    video = 2,
    img = 3
}

export class CreateExtraDTO{
    readonly round:Round;
    readonly extraType:number;
    readonly url:string;
}

export class UpdateExtraDTO{
    readonly extraType:number;
    readonly url:string;
}