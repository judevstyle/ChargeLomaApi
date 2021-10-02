import { Prisma } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStationDto, FindFilterQuery, FindOne, FindQuery, StationfromLocation, StationNearby } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import * as Distance from 'geo-distance'
import * as lodash from 'lodash'
import * as fileType from 'file-type'
import * as fs from 'fs'
import { join } from 'path';
import { removeEmptyObjects } from 'src/helper/object';
import { pagination, ParameterPagination } from 'src/helper/pagination';

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

      if (numIsChargeTrue + numIsChargeFalse < 5 || !item.Checkin) {
        item['rating'] = 0
      } else {
        item['rating'] = (numIsChargeTrue / (numIsChargeTrue + numIsChargeFalse)) * 10
      }



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

    let paramPagination: ParameterPagination = {
      data: station,
      page: +query.page,
      limit: query.limit,
      responseFrom: "DATA",
      totalItems: station.length
    }

    return pagination(paramPagination)

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

      if (numIsChargeTrue + numIsChargeFalse < 5 || !item.Checkin) {
        item['rating'] = 0
      } else {
        item['rating'] = (numIsChargeTrue / (numIsChargeTrue + numIsChargeFalse)) * 10
      }


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

    let objectCreateStation: any = {
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
      },
    }

    if (createStationDto.station_img) {
      try {
        let strImage = createStationDto.station_img.replace(/^data:image\/[a-z]+;base64,/, "");
        let buff = Buffer.from(strImage, 'base64');

        let pathFolder = join(__dirname, '..', '..', 'public', "station_img")

        let getfileType = await fileType.fromBuffer(buff)
        let nameFiles = `${Date.now()}_icon.${getfileType.ext}`;
        fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

        objectCreateStation.station_img = process.env.API_URL + "/station_img/" + nameFiles
      } catch (error) {

      }

    }

    let station = await this.prismaService.station.create({
      data: objectCreateStation,
      include: {
        PlugMapping: true,
        ProviderMaster: true
      }
    })

    return station;
  }

  async findAll(query: FindQuery) {
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
        },
        Checkin: true
      }, orderBy: { created_date: "desc" }
    })


    stations = stations.map((item) => {

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

      if (numIsChargeTrue + numIsChargeFalse < 5 || !item.Checkin) {
        item['rating'] = 0
      } else {
        item['rating'] = (numIsChargeTrue / (numIsChargeTrue + numIsChargeFalse)) * 10
      }


      delete item.Checkin

      return item
    })

    return stations;
  }

  async stationFilter(query: FindFilterQuery) {

    let stationsCount = await this.prismaService.station.count({
      where: { deleted: false, pv_id: +query.provider, type_service: query.type }
    })
    let stations = await this.prismaService.station.findMany({
      where: { deleted: false, pv_id: +query.provider, type_service: query.type },
      skip: (+query.page - 1) * +query.limit,
      take: query.limit,
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
        },
        Checkin: true
      }, orderBy: { created_date: "desc" }
    })


    stations = stations.map((item) => {

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

      if (numIsChargeTrue + numIsChargeFalse < 5 || !item.Checkin) {
        item['rating'] = 0
      } else {
        item['rating'] = (numIsChargeTrue / (numIsChargeTrue + numIsChargeFalse)) * 10
      }


      delete item.Checkin

      return item
    })


    let paramPagination: ParameterPagination = {
      data: stations,
      page: +query.page,
      limit: query.limit,
      responseFrom: "DB",
      totalItems: stationsCount
    }

    return pagination(paramPagination)
  }

  async stationApprove(query: FindQuery) {

    let stationsCount = await this.prismaService.station.count({
      where: { deleted: false, status_approve: "S" }
    })


    let stations = await this.prismaService.station.findMany({
      where: { deleted: false, status_approve: "S" },
      skip: (+query.page - 1) * +query.limit,
      take: query.limit,
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
        },
        Checkin: true
      }, orderBy: { created_date: "desc" }
    })


    stations = stations.map((item) => {

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

      if (numIsChargeTrue + numIsChargeFalse < 5 || !item.Checkin) {
        item['rating'] = 0
      } else {
        item['rating'] = (numIsChargeTrue / (numIsChargeTrue + numIsChargeFalse)) * 10
      }


      delete item.Checkin

      return item
    })


    let paramPagination: ParameterPagination = {
      data: stations,
      page: +query.page,
      limit: query.limit,
      responseFrom: "DB",
      totalItems: stationsCount
    }

    return pagination(paramPagination)
  }

  async stationWaitApprove(query: FindQuery) {

    let stationsCount = await this.prismaService.station.count({
      where: { deleted: false, status_approve: "W" }
    })


    let stations = await this.prismaService.station.findMany({
      where: { deleted: false, status_approve: "W" },
      skip: (+query.page - 1) * +query.limit,
      take: query.limit,
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
        },
        Checkin: true
      }, orderBy: { created_date: "desc" }
    })


    stations = stations.map((item) => {

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

      if (numIsChargeTrue + numIsChargeFalse < 5 || !item.Checkin) {
        item['rating'] = 0
      } else {
        item['rating'] = (numIsChargeTrue / (numIsChargeTrue + numIsChargeFalse)) * 10
      }


      delete item.Checkin

      return item
    })


    let paramPagination: ParameterPagination = {
      data: stations,
      page: +query.page,
      limit: query.limit,
      responseFrom: "DB",
      totalItems: stationsCount
    }

    return pagination(paramPagination)
  }


  async stationReject(query: FindQuery) {

    let stationsCount = await this.prismaService.station.count({
      where: { deleted: false, status_approve: "F" }
    })


    let stations = await this.prismaService.station.findMany({
      where: { deleted: false, status_approve: "F" },
      skip: (+query.page - 1) * +query.limit,
      take: query.limit,
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
        },
        Checkin: true
      }, orderBy: { created_date: "desc" }
    })


    stations = stations.map((item) => {

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

      if (numIsChargeTrue + numIsChargeFalse < 5 || !item.Checkin) {
        item['rating'] = 0
      } else {
        item['rating'] = (numIsChargeTrue / (numIsChargeTrue + numIsChargeFalse)) * 10
      }


      delete item.Checkin

      return item
    })


    let paramPagination: ParameterPagination = {
      data: stations,
      page: +query.page,
      limit: query.limit,
      responseFrom: "DB",
      totalItems: stationsCount
    }

    return pagination(paramPagination)
  }


  async findOne(id: string, query: FindOne) {
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
        Checkin: true,
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

    if (query.lang == 'th') {
      stations['station_name'] = stations.station_name_th
      stations['addr'] = stations.addr_th
    }

    if (query.lang == 'en') {
      stations['station_name'] = stations.station_name_en
      stations['addr'] = stations.addr_en
    }

    delete stations.station_name_en
    delete stations.station_name_th
    delete stations.addr_en
    delete stations.addr_th


    stations['provider'] = stations.ProviderMaster

    const numIsChargeTrue = stations.Checkin.reduce((acc, cur) => {
      if (cur.isCharge == true) {
        acc += 1
      }
      return acc
    }, 0)

    const numIsChargeFalse = stations.Checkin.reduce((acc, cur) => {
      if (cur.isCharge == false) {
        acc += 1
      }
      return acc
    }, 0)

    if (numIsChargeTrue + numIsChargeFalse < 5 || !stations.Checkin) {
      stations['rating'] = 0
    } else {
      stations['rating'] = (numIsChargeTrue / (numIsChargeTrue + numIsChargeFalse)) * 10
    }


    delete stations.Checkin

    delete stations.ProviderMaster

    return stations
  }

  async update(id: string, updateStationDto: CreateStationDto) {

    let stationCheck = await this.prismaService.station.findFirst({ where: { st_id: id } })

    if (!stationCheck) throw new BadRequestException("station Not found")

    const idDelete = updateStationDto.PlugMapping.filter((val) => (val.del == true)).map((item) => (item.p_mapping_id))

    const filterInsertPlugMapping: Prisma.PlugMappingCreateManyStationInput[] = updateStationDto.PlugMapping.filter((item) => (item.del == false)).map((item) => ({
      qty: item.qty,
      p_type_id: item.p_type_id,
      power: item.power
    }))

    let insertPlugMap: Prisma.PlugMappingCreateManyStationInputEnvelope = {
      data:filterInsertPlugMapping
    }

    let objectUpdateStation: Prisma.StationUpdateArgs = {
      data: {
        station_name_th: updateStationDto.station_name_th,
        station_name_en: updateStationDto.station_name_en,
        station_desc: updateStationDto.station_desc,
        addr_th: updateStationDto.addr_th,
        addr_en: updateStationDto.addr_en,
        lat: updateStationDto.lat,
        lng: updateStationDto.lng,
        type_service: updateStationDto.type_service,
        is24hr: updateStationDto.is24hr,
        servicetime_open: updateStationDto.servicetime_open,
        servicetime_close: updateStationDto.servicetime_close,
        is_service_charge: updateStationDto.is_service_charge,
        service_rate: updateStationDto.service_rate,
        status_approve: updateStationDto.status_approve,
        status_msg: updateStationDto.status_msg,
        station_status: updateStationDto.station_status,
        note: updateStationDto.note,
        power: updateStationDto.power,
        pv_id: updateStationDto.pv_id,
        PlugMapping: {
          deleteMany: {
            p_mapping_id: {
              in: idDelete
            }
          },
        }
      },
      where: {
        st_id: id
      },
      include: {
        PlugMapping: true,
        ProviderMaster: true
      }

    }

    objectUpdateStation.data = removeEmptyObjects(objectUpdateStation.data)


    if(filterInsertPlugMapping.length>0){
      objectUpdateStation.data.PlugMapping.createMany = insertPlugMap
    }

    if (updateStationDto.station_img) {
      try {
        let strImage = updateStationDto.station_img.replace(/^data:image\/[a-z]+;base64,/, "");
        let buff = Buffer.from(strImage, 'base64');

        let pathFolder = join(__dirname, '..', '..', 'public', "station_img")

        let getfileType = await fileType.fromBuffer(buff)
        let nameFiles = `${Date.now()}_icon.${getfileType.ext}`;
        fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

        objectUpdateStation.data.station_img = process.env.API_URL + "/station_img/" + nameFiles
      } catch (error) {

      }

    }

    let station = await this.prismaService.station.update(objectUpdateStation)

    return station;
  }

  async remove(id: string) {
    const station = await this.prismaService.station.delete({ where: { st_id: id } })
    return station
  }
}
