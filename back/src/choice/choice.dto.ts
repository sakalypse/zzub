import { Round } from "src/round/round.entity";

export class CreateChoiceDTO{
    readonly round:Round;
    readonly choice:string;
    readonly isAnswer:boolean
}

export class UpdateChoiceDTO{
    readonly choice:string;
    readonly isAnswer:boolean
}