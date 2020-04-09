import { Round } from "src/round/round.entity";

export class CreateExtraDTO{
    readonly round:Round;
    readonly url:string;
}

export class UpdateExtraDTO{
    readonly url:string;
}