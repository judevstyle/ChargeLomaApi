import { IsDefined, IsNotEmpty } from "class-validator";

export class LoginBackOfficeDTO {
    @IsNotEmpty()
    @IsDefined()
    username: string
    @IsNotEmpty()
    @IsDefined()
    password: string
}