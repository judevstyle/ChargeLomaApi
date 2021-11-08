import { IsDefined, IsNotEmpty } from "class-validator";

export class RegisterBackOfficeDTO {
    @IsNotEmpty()
    @IsDefined()
    username: string
    @IsNotEmpty()
    @IsDefined()
    password: string
}