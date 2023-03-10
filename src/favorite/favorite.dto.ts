import { IsDefined, IsNotEmpty } from "class-validator";

export class PostFavorite {
    @IsDefined()
    @IsNotEmpty()
    st_id: string
}

export class GetFavStation {
    @IsDefined()
    @IsNotEmpty()
    st_id: string
}

export class FindOneFavorite{
    @IsDefined()
    @IsNotEmpty()
    st_id: string
}

export class GetStationFavorite{
    queryStamp?: string
    page?: number = 1
    limit?: number = 100
    lang: string = 'th'
}