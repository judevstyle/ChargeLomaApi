import { BadRequestException, Injectable } from '@nestjs/common';
import { pagination, ParameterPagination } from 'src/helper/pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindOneFavorite, GetStationFavorite, PostFavorite } from './favorite.dto';
import * as lodash from 'lodash'

@Injectable()
export class FavoriteService {

    constructor(private readonly prismaService: PrismaService) { }

    async postFavorite(uid: string, body: PostFavorite) {

        const checkStation = await this.prismaService.station.findFirst({ where: { st_id: body.st_id } })

        if (!checkStation) {
            throw new BadRequestException("Station Not found")
        }

        let favorite = await this.prismaService.favoriteStation.create({
            data: {
                uid: uid,
                st_id: body.st_id,
                create_by: uid
            }
        })

        return favorite

    }

    async getStationFavorite(uid: string, query: GetStationFavorite) {
        let countFavorite = await this.prismaService.favoriteStation.count({
            where: {
                deleted: false,
                uid: uid
            }
        })

        let favorite = await this.prismaService.favoriteStation.findMany({
            where: {
                deleted: false,
                uid: uid
            },
            skip: (+query.page - 1) * +query.limit,
            take: +query.limit,
            select: {
                fav_id: true,
                Station: {
                    select: {
                        st_id: true,
                        station_name_en: true,
                        station_name_th: true,
                        station_desc: true,
                        station_img: true,
                        addr_en: true,
                        addr_th: true,
                        type_service: true,
                        is24hr: true,
                        servicetime_open: true,
                        servicetime_close: true,
                        station_status: true,
                        power: true,
                        ProviderMaster: true,
                        PlugMapping: {
                            include: {
                                PlugTypeMaster: true
                            }
                        },
                        Checkin: true,
                    }
                }
            },
            orderBy: {
                created_date: "desc"
            }
        })

        const result = favorite.map((item) => {
            let station = item.Station

            station['provider'] = station.ProviderMaster

            delete station.ProviderMaster

            if (query.lang == 'th') {
                station['station_name'] = station.station_name_th
                station['addr'] = station.addr_th
            }

            if (query.lang == 'en') {
                station['station_name'] = station.station_name_en
                station['addr'] = station.addr_en
            }

            station['plug_desc'] = lodash.uniq(station.PlugMapping.map((plugMapping) => (plugMapping.PlugTypeMaster.p_title))).join(",")
            delete station.PlugMapping

            delete station.station_name_en
            delete station.station_name_th
            delete station.addr_en
            delete station.addr_th

            const numIsChargeTrue = station.Checkin.reduce((acc, cur) => {
                if (cur.isCharge == true) {
                    acc += 1
                }
                return acc
            }, 0)

            const numIsChargeFalse = station.Checkin.reduce((acc, cur) => {
                if (cur.isCharge == false) {
                    acc += 1
                }
                return acc
            }, 0)

            if (numIsChargeTrue + numIsChargeFalse < 5 || !station.Checkin) {
                station['rating'] = 0
            } else {
                station['rating'] = (numIsChargeTrue / (numIsChargeTrue + numIsChargeFalse)) * 10
            }


            delete station.Checkin

            return { fav_id: item.fav_id, station }
        })

        let paramPagination: ParameterPagination = {
            data: result,
            page: +query.page,
            limit: query.limit,
            responseFrom: "DB",
            totalItems: countFavorite
        }

        return pagination(paramPagination)

    }

    async favStation(st_id: string, uid: string) {
        const checkFav = await this.prismaService.favoriteStation.findFirst({ where: { create_by: uid, st_id: st_id, deleted: false } })

        if (checkFav) {
            return {
                isFavorite: true,
                fav_id: checkFav.fav_id
            }
        }

        return {
            isFavorite: false
        }
    }

    async deleteFavorite(param: FindOneFavorite) {
        const favorite = await this.prismaService.favoriteStation.delete({
            where: {
                fav_id: param.fav_id
            }
        })

        return favorite
    }

}
