import { Category } from "src/category/category.entity";
import { Choice } from "src/choice/choice.entity";
import { Extra } from "src/extra/extra.entity";

export class CreateRoundDTO{
    readonly category:Category;
    readonly question:string;
}

export class UpdateRoundDTO{
    readonly question:string;
}