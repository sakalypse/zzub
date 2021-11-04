import { Pack } from "src/pack/pack.entity";
import { Choice } from "src/choice/choice.entity";
import { Extra } from "src/extra/extra.entity";

export class CreateRoundDTO{
    readonly pack:Pack;
}

export class UpdateRoundDTO{
    readonly question:string;
    readonly isMultipleChoice:boolean;
}