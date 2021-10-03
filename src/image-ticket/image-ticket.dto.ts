import { IsDefined, IsNotEmpty } from "class-validator";

export class PostImageTicket {
    @IsDefined()
    img: Image[]
    status_msg: string = ""
}

export class Image {
    @IsDefined()
    @IsNotEmpty()
    img_base64: string
}