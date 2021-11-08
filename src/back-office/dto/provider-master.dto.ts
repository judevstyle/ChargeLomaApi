import { IsDefined, IsNotEmpty } from "class-validator"

export class CreateUpdateProviderMasterDto {
    @IsDefined()
    @IsNotEmpty()
    name: string
    desv: string
    icon: string
    shortname:string
    logo_label:string
}
