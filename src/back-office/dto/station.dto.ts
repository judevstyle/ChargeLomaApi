import { IsDefined, IsNotEmpty } from "class-validator";

export class FindAll {
    queryStamp?: string
    page?: number = 1
    limit?: number = 100
    lang: string = 'th'
    search: string;
}


export class CreateUpdateStationDto {
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
    PlugMapping: PlugMapping[] = []
    pv_id: number
    station_img: string

    tel: string;
    is_service_parking: boolean
    is_service_food: boolean
    is_service_coffee: boolean
    is_service_restroom: boolean
    is_service_shoping: boolean
    is_service_restarea: boolean
    is_service_wifi: boolean
    is_service_other: boolean
}

export class PlugMapping {
    qty: number = 0
    power: string
    p_type_id: number
    del: boolean
    p_mapping_id: number
}