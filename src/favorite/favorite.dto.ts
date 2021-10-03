import { IsDefined, IsNotEmpty } from "class-validator";

export class PostFavorite {
    @IsDefined()
    @IsNotEmpty()
    st_id: string
}

export class FindOneFavorite{
    @IsDefined()
    @IsNotEmpty()
    fav_id: string
}

export class GetStationFavorite{
    queryStamp?: string
    page?: number = 1
    limit?: number = 100
    lang: string
}