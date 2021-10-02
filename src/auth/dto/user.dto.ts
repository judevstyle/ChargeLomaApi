import { IsDefined, IsNotEmpty } from "class-validator";

export class RegisterDTO {
    @IsNotEmpty()
    @IsDefined()
    uid: string
    @IsNotEmpty()
    @IsDefined()
    display_name: string
    @IsNotEmpty()
    @IsDefined()
    email: string;
    tel: string;
    avatar: string;
}

export class LoginDTO {
    @IsNotEmpty()
    @IsDefined()
    uid: string
}

export class UpdateProfileDTO{
    @IsNotEmpty()
    @IsDefined()
    uid: string
    display_name: string
    email: string;
    tel: string;
    avatar: string;
}