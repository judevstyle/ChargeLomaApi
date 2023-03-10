import { IsDefined, IsNotEmpty } from "class-validator";

export class CreateProviderMasterDto {
    @IsDefined()
    @IsNotEmpty()
    name: string
    desv: string
    icon: string
    shortname:string
    logo_label:string
}
