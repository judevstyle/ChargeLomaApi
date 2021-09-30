import { IsDefined, IsNotEmpty } from "class-validator";

export class CreatePlugTypeMasterDto {
    @IsNotEmpty()
    @IsDefined()
    p_title: string;
    p_icon: string
}
