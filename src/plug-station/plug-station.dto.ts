import { IsDefined, IsNotEmpty } from "class-validator";

export class FindPlugStation{
    @IsDefined()
    @IsNotEmpty()
    st_id:string
}