import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindPlugStation } from './plug-station.dto';

@Injectable()
export class PlugStationService {

    constructor(private readonly prismaService: PrismaService) { }

    async getPlugStation(query: FindPlugStation) {
        let checkStation = await this.prismaService.station.findFirst({ where: { st_id: query.st_id } })

        if (!checkStation) {
            throw new BadRequestException("station not found")
        }

        let plugStation = await this.prismaService.plugMapping.findMany({
            where: { st_id: query.st_id },
            select: {
                qty: true,
                power: true,
                PlugTypeMaster: {
                    select: {
                        p_type_id:true,
                        p_title: true,
                        p_icon: true
                    }
                }
            },
            orderBy:{
                created_date:"desc"
            }
        })

        plugStation = plugStation.map((item)=>{
            item['plug_type'] = item.PlugTypeMaster

            delete item.PlugTypeMaster

            return item
        })

        return plugStation
    }

}
