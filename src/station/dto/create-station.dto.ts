import { IsDefined, IsNotEmpty, IsString } from "class-validator"

export class CreateStationDto {
    @IsDefined()
    @IsNotEmpty()
    station_name_th: string
    station_name_en: string
    station_desc: string
    addr_th: string
    addr_en: string
    @IsDefined()
    @IsNotEmpty()
    lat: number
    @IsDefined()
    @IsNotEmpty()
    lng: number
    type_service: 'public' | 'private'
    is24hr: boolean
    servicetime_open: string
    servicetime_close: string
    is_service_charge: boolean
    service_rate: number
    status_approve: 'W' | 'S' | 'F'
    status_msg: string
    station_status: number
    note: string
    power: number
    PlugMapping: PlugMapping[]
    pv_id: number
    station_img: string
}

export class StationNearby {
    @IsDefined()
    @IsNotEmpty()
    lat: number
    @IsDefined()
    @IsNotEmpty()
    lng: number
    queryStamp: string
    page?: number = 1
    limit?: number = 100
    lang: string = 'th'
}

export class FindQuery {
    queryStamp?: string
    page?: number = 1
    limit?: number = 100
    lang: string = 'th'
}


export class FindImageStationQuery {
    @IsDefined()
    @IsNotEmpty()
    st_id: string
    queryStamp?: string
    page?: number = 1
    limit?: number = 100
    lang: string = 'th'
}


export class FindFilterQuery {
    queryStamp?: string
    page?: number = 1
    limit?: number = 100
    lang: string = 'th'
    @IsDefined()
    @IsNotEmpty()
    provider?: number
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    type?: string
}


export class FindPostStationFilter {
    lang: string = 'th'
    plug: number[]
    provider: number[]
    status: number[]
}
export class StationfromLocation {
    @IsDefined()
    @IsNotEmpty()
    lat00: number;
    @IsDefined()
    @IsNotEmpty()
    lng00: number;
    @IsDefined()
    @IsNotEmpty()
    lat01: number;
    @IsDefined()
    @IsNotEmpty()
    lng01: number;
    @IsDefined()
    @IsNotEmpty()
    lat10: number;
    @IsDefined()
    @IsNotEmpty()
    lng10: number;
    @IsDefined()
    @IsNotEmpty()
    lat11: number;
    @IsDefined()
    @IsNotEmpty()
    lng11: number;
    queryStamp: string;
    lang: string = 'th'
}

export class PlugMapping {
    qty: number
    power: string
    p_type_id: number
    del: boolean
    p_mapping_id: number
}

export class FindOne {
    lang: string = 'th'
}