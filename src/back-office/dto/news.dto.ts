import { IsDefined, IsNotEmpty } from "class-validator"

export class CreateUpdateNews {
    @IsNotEmpty()
    @IsDefined()
    title: string
    @IsNotEmpty()
    @IsDefined()
    desc: string
    image: string
}