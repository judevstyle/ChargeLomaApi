import { Prisma } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStationDto, StationfromLocation, StationNearby } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import * as Distance from 'geo-distance'
import * as lodash from 'lodash'

var pointInPolygon = require('point-in-polygon');
var pointInPolygonFlat = require('point-in-polygon/flat');
var pointInPolygonNested = require('point-in-polygon/nested');

@Injectable()
export class StationService {

  constructor(private prismaService: PrismaService) { }

  async stationNearly(query: StationNearby) {
    let station = await this.prismaService.station.findMany({
      where: { deleted: false },
      select: {
        station_name_th: true,
        station_name_en: true,
        station_img: true,
        st_id: true,
        addr_en: true,
        addr_th: true,
        type_service: true,
        lat: true,
        lng: true,
        is24hr: true,
        servicetime_open: true,
        servicetime_close: true,
        station_status: true,
        power: true,
        ProviderMaster: {
          select: {
            pv_id: true,
            name: true,
            desv: true,
            icon: true
          }
        },
        PlugMapping: {
          include: {
            PlugTypeMaster: true
          }
        },
        Checkin: true
      }
    })

    station = station.map((item) => {

      item['provider'] = item.ProviderMaster

      delete item.ProviderMaster

      if (query.lang == 'th') {
        item['station_name'] = item.station_name_th
        item['addr'] = item.addr_th
      }

      if (query.lang == 'en') {
        item['station_name'] = item.station_name_en
        item['addr'] = item.addr_en
      }

      item['plug_desc'] = lodash.uniq(item.PlugMapping.map((item) => (item.PlugTypeMaster.p_title))).join(",")
      delete item.PlugMapping

      delete item.station_name_en
      delete item.station_name_th
      delete item.addr_en
      delete item.addr_th

      const numIsChargeTrue = item.Checkin.reduce((acc, cur) => {
        if (cur.isCharge == true) {
          acc += 1
        }
        return acc
      }, 0)

      const numIsChargeFalse = item.Checkin.reduce((acc, cur) => {
        if (cur.isCharge == false) {
          acc += 1
        }
        return acc
      }, 0)

      item['rating'] = (numIsChargeTrue/(numIsChargeTrue+numIsChargeFalse))*10 || 0
      

      delete item.Checkin

      return item
    })

    station = station.map((item) => {
      item['distance'] = Distance.between({
        lat: query.lat,
        lng: query.lng
      }, {
        lat: item.lat,
        lng: item.lng
      }).radians
      return item
    })

    
    

    station = station.sort(function (a, b) {
      if (a['distance'] < b['distance']) {
        return -1
      }
      if (a['distance'] > b['distance']) {
        return 1
      }

      return 0
    })

    return station

  }


  async stationfromLocation(query: StationfromLocation) {
    let station = await this.prismaService.station.findMany({
      where: { deleted: false },
      select: {
        station_name_th: true,
        station_name_en: true,
        st_id: true,
        station_img: true,
        addr_en: true,
        addr_th: true,
        type_service: true,
        lat: true,
        lng: true,
        is24hr: true,
        servicetime_open: true,
        servicetime_close: true,
        station_status: true,
        power: true,
        ProviderMaster: {
          select: {
            pv_id: true,
            name: true,
            desv: true,
            icon: true
          }
        },
        PlugMapping: {
          include: {
            PlugTypeMaster: true
          }
        },
        Checkin: true
      }
    })

    const polygon = [
      [
        Number.parseFloat(query.lat00.toString()),
        Number.parseFloat(query.lng00.toString())
      ],
      [
        Number.parseFloat(query.lat01.toString()),
        Number.parseFloat(query.lng01.toString())
      ],
      [
        Number.parseFloat(query.lat10.toString()),
        Number.parseFloat(query.lng10.toString())
      ],
      [
        Number.parseFloat(query.lat11.toString()),
        Number.parseFloat(query.lng11.toString())
      ],
      [
        Number.parseFloat(query.lat00.toString()),
        Number.parseFloat(query.lng00.toString())
      ]
    ]

    // console.log(polygon);

    station = station.map((item) => {

      item['provider'] = item.ProviderMaster

      delete item.ProviderMaster

      if (query.lang == 'th') {
        item['station_name'] = item.station_name_th
        item['addr'] = item.addr_th
      }

      if (query.lang == 'en') {
        item['station_name'] = item.station_name_en
        item['addr'] = item.addr_en
      }

      item['plug_desc'] = lodash.uniq(item.PlugMapping.map((item) => (item.PlugTypeMaster.p_title))).join(",")
      delete item.PlugMapping

      delete item.station_name_en
      delete item.station_name_th
      delete item.addr_en
      delete item.addr_th

      const numIsChargeTrue = item.Checkin.reduce((acc, cur) => {
        if (cur.isCharge == true) {
          acc += 1
        }
        return acc
      }, 0)

      const numIsChargeFalse = item.Checkin.reduce((acc, cur) => {
        if (cur.isCharge == false) {
          acc += 1
        }
        return acc
      }, 0)

      item['rating'] = (numIsChargeTrue/(numIsChargeTrue+numIsChargeFalse))*10 || 0

      delete item.Checkin

      return item
    })

    station = station.filter((item) => {
      return pointInPolygon([item.lat, item.lng], polygon,)
    })

    return station

  }

  async create(createStationDto: CreateStationDto) {

    let providerMaster = await this.prismaService.providerMaster.findFirst({ where: { pv_id: createStationDto.pv_id } })

    if (!providerMaster) throw new BadRequestException("pv_id Not found in ProviderMaster")

    let station = await this.prismaService.station.create({
      data: {
        station_name_th: createStationDto.station_name_th,
        station_name_en: createStationDto.station_name_en,
        station_desc: createStationDto.station_desc,
        addr_th: createStationDto.addr_th,
        addr_en: createStationDto.addr_en,
        lat: createStationDto.lat,
        lng: createStationDto.lng,
        type_service: createStationDto.type_service,
        is24hr: createStationDto.is24hr,
        servicetime_open: createStationDto.servicetime_open,
        servicetime_close: createStationDto.servicetime_close,
        is_service_charge: createStationDto.is_service_charge,
        service_rate: createStationDto.service_rate,
        status_approve: createStationDto.status_approve,
        status_msg: createStationDto.status_msg,
        station_status: createStationDto.station_status,
        note: createStationDto.note,
        power: createStationDto.power,
        pv_id: createStationDto.pv_id,
        PlugMapping: {
          createMany: {
            data: createStationDto.PlugMapping
          }
        }
      }
    })

    return station;
  }

  async findAll() {
    let stations = await this.prismaService.station.findMany({
      where: { deleted: false },
      include: {
        ProviderMaster: {
          select: {
            pv_id: true,
            name: true,
            desv: true,
            icon: true
          }
        },
        PlugMapping: {
          select: {
            p_mapping_id: true,
            qty: true,
            power: true,
            PlugTypeMaster: {
              select: {
                p_title: true,
                p_icon: true
              }
            }
          }
        }
      }, orderBy: { created_date: "desc" }
    })

    stations = stations.map((item) => {

      item['provider'] = item.ProviderMaster

      delete item.ProviderMaster

      return item
    })

    return stations;
  }

  async findOne(id: string) {
    let stations = await this.prismaService.station.findFirst({
      where: {
        st_id: id,
        deleted: false
      },
      include: {
        ProviderMaster: {
          select: {
            pv_id: true,
            name: true,
            desv: true,
            icon: true
          }
        },
        PlugMapping: {
          select: {
            p_mapping_id: true,
            qty: true,
            power: true,
            PlugTypeMaster: {
              select: {
                p_title: true,
                p_icon: true
              }
            }
          }
        }
      }, orderBy: { created_date: "desc" }
    })

    stations['provider'] = stations.ProviderMaster

    delete stations.ProviderMaster

    return stations
  }

  update(id: string, updateStationDto: UpdateStationDto) {
    return `This action updates a #${id} station`;
  }

  async remove(id: string) {
    const station = await this.prismaService.station.delete({ where: { st_id: id } })
    return station
  }
}
