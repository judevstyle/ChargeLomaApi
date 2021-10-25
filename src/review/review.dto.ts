import { IsDefined, IsNotEmpty } from "class-validator";

export class PostReview {
    @IsDefined()
    @IsNotEmpty()
    st_id: string;
    comment: string;
    // @IsDefined()
    // @IsNotEmpty()
    isCharge?: boolean;
    car_serve: string;
    power: number;
    review_img: ReviewIMG[]
}

export class ReviewIMG {
    @IsDefined()
    @IsNotEmpty()
    img_base64: string;
    id_img:number;
    del?: boolean
}

export class ParamFindOne{
    @IsDefined()
    @IsNotEmpty()
    ck_id: number;
}

export class FindAll{
    @IsDefined()
    @IsNotEmpty()
    st_id:string
    page:number = 1
    limit:number = 100
}

export class FindReviewByUser{
    @IsDefined()
    @IsNotEmpty()
    uid:string
    page:number = 1
    limit:number = 100
    lang: string = 'th'
}