import { IsNotEmpty } from "class-validator";

export class CreateUpdatePlugTypeMasterDto {
    @IsNotEmpty()
    p_title: string;
    p_icon: string
    p_type: "AC" | "DC"
}
