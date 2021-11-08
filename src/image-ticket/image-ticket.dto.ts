import { IsDefined, IsNotEmpty } from "class-validator";

export class PostImageTicket {
    @IsDefined()
    img: Image[]
    status_msg: string = ""
    @IsNotEmpty()
    @IsDefined()
    st_id:string
}

export class Image {
    @IsDefined()
    @IsNotEmpty()
    img_base64: string
}