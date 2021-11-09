import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUpdateStationDto, FindAll } from '../dto/station.dto';
import * as lodash from 'lodash'
import * as fileType from 'file-type'
import * as fs from 'fs'
import { join } from 'path';
import { removeEmptyObjects } from 'src/helper/object';
import { Prisma } from '@prisma/client';

@Injectable()
export class StationService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAll(query: FindAll) {
        let stations = await this.prismaService.station.findMany({
            where: {
                OR: [
                    {
                        st_id: { contains: query.search }
                    },
                    {
                        station_name_en: { contains: query.search }
                    },
                    {
                        station_name_th: { contains: query.search }
                    },

                ],
                deleted: false,

            },
            include: {
                ProviderMaster: {
                    select: {
                        pv_id: true,
                        name: true,
                        logo_label: true,
                        shortname: true,
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


        //   stations = stations.map((item) => {

        //     item['provider'] = item.ProviderMaster

        //     delete item.ProviderMaster

        //     if (query.lang == 'th') {
        //       item['station_name'] = item.station_name_th
        //       item['addr'] = item.addr_th
        //     }

        //     if (query.lang == 'en') {
        //       item['station_name'] = item.station_name_en
        //       item['addr'] = item.addr_en
        //     }

        //     item['plug_desc'] = lodash.uniq(item.PlugMapping.map((item) => (item.PlugTypeMaster.p_title))).join(",")
        //     delete item.PlugMapping

        //     delete item.station_name_en
        //     delete item.station_name_th
        //     delete item.addr_en
        //     delete item.addr_th

        //     const numIsChargeTrue = item.Checkin.reduce((acc, cur) => {
        //       if (cur.isCharge == true) {
        //         acc += 1
        //       }
        //       return acc
        //     }, 0)

        //     const numIsChargeFalse = item.Checkin.reduce((acc, cur) => {
        //       if (cur.isCharge == false) {
        //         acc += 1
        //       }
        //       return acc
        //     }, 0)

        //     // if (numIsChargeTrue + numIsChargeFalse < 5 || !item.Checkin) {
        //     //   item['rating'] = 0
        //     // } else {
        //     //   item['rating'] = (numIsChargeTrue / (numIsChargeTrue + numIsChargeFalse)) * 10
        //     // }


        //     delete item.Checkin

        //     return item
        //   })

        return stations;
    }

    async findAllDummy(query: FindAll) {
        let stations = await this.prismaService.stationDummy.findMany({
            where: { deleted: false ,
                OR: [
                    {
                        st_id: { contains: query.search }
                    },
                    {
                        station_name_en: { contains: query.search }
                    },
                    {
                        station_name_th: { contains: query.search }
                    },

                ],
            },
            include: {
                ProviderMaster: {
                    select: {
                        pv_id: true,
                        name: true,
                        logo_label: true,
                        shortname: true,
                        desv: true,
                        icon: true
                    }
                },
                PlugMappingDummy: {
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
                // Checkin: true
            }, orderBy: { created_date: "desc" }
        })


        return stations;
    }


    async findAllProviderMaster() {
        return this.prismaService.providerMaster.findMany({ orderBy: { created_date: "desc" } })
    }

    async findAllPlugTypeMaster() {
        return this.prismaService.plugTypeMaster.findMany({ orderBy: { created_date: "desc" } })
    }

    async createStation(createStationDto: CreateUpdateStationDto) {

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
            tel: createStationDto.tel,
            is_service_parking: createStationDto.is_service_parking,
            is_service_food: createStationDto.is_service_food,
            is_service_coffee: createStationDto.is_service_coffee,
            is_service_restroom: createStationDto.is_service_restroom,
            is_service_shoping: createStationDto.is_service_shoping,
            is_service_restarea: createStationDto.is_service_restarea,
            is_service_wifi: createStationDto.is_service_wifi,
            is_service_other: createStationDto.is_service_other,
            note: createStationDto.note,
            power: createStationDto.power,
            //   create_by: uid,
            pv_id: createStationDto.pv_id,
            PlugMapping: {
                createMany: {
                    data: createStationDto.PlugMapping.map((item) => {
                        delete item.del
                        item.power = item.power.toString()
                        return item
                    })
                }
            },
        }

        console.log("Create Before remove", objectCreateStation);

        // objectCreateStation = removeEmptyObjects(objectCreateStation)

        console.log("Create", objectCreateStation);


        if (createStationDto.station_img) {
            try {
                let strImage = createStationDto.station_img.replace(/^data:image\/[a-z]+;base64,/, "");
                let buff = Buffer.from(strImage, 'base64');

                let pathFolder = join(__dirname, '..', '..', '..', 'public', "station_img")

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

    async findOne(st_id: string) {
        let stations = await this.prismaService.station.findFirst({
            where: {
                st_id: st_id,
                deleted: false,
            },
            include: {
                ProviderMaster: {
                    select: {
                        pv_id: true,
                        logo_label: true,
                        shortname: true,
                        name: true,
                        desv: true,

                        icon: true
                    }
                },
                Checkin: true,
                PlugMapping: {
                    where: {
                        deleted: false,
                    },
                    select: {
                        p_mapping_id: true,
                        p_type_id: true,
                        qty: true,
                        power: true,
                        PlugTypeMaster: {
                            select: {
                                p_title: true,
                                p_icon: true,
                                p_type_id: true
                            }
                        }
                    }
                }
            }, orderBy: { created_date: "desc" }
        })

        return stations
    }

    async findOneDummy(st_id: string) {
        let stations = await this.prismaService.stationDummy.findFirst({
            where: {
                st_id: st_id,
                deleted: false,
            },
            include: {
                ProviderMaster: {
                    select: {
                        pv_id: true,
                        logo_label: true,
                        shortname: true,
                        name: true,
                        desv: true,

                        icon: true
                    }
                },
                // Checkin: true,
                PlugMappingDummy: {
                    where: {
                        deleted: false,
                    },
                    select: {
                        p_mapping_id: true,
                        p_type_id: true,
                        qty: true,
                        power: true,
                        PlugTypeMaster: {
                            select: {
                                p_title: true,
                                p_icon: true,
                                p_type_id: true
                            }
                        }
                    }
                }
            }, orderBy: { created_date: "desc" }
        })

        return stations
    }

    async approveStationDummy(st_id: string) {
        let stationDummy = await this.prismaService.stationDummy.findFirst({
            where: {
                st_id: st_id,
                status_approve: 'W',
                deleted: false,
            },
            include: {
                ProviderMaster: {
                    select: {
                        pv_id: true,
                        logo_label: true,
                        shortname: true,
                        name: true,
                        desv: true,

                        icon: true
                    }
                },
                // Checkin: true,
                PlugMappingDummy: {
                    where: {
                        deleted: false,
                    },
                    select: {
                        p_mapping_id: true,
                        p_type_id: true,
                        qty: true,
                        power: true,
                        // PlugTypeMaster: {
                        //     select: {
                        //         p_title: true,
                        //         p_icon: true,
                        //         p_type_id: true
                        //     }
                        // }
                    }
                }
            }, orderBy: { created_date: "desc" }
        })


        if (stationDummy) {
            let createStationObject: Prisma.StationCreateArgs = {
                data: {
                    station_name_th: stationDummy.station_name_th,
                    station_name_en: stationDummy.station_name_en,
                    station_desc: stationDummy.station_desc,
                    addr_th: stationDummy.addr_th,
                    addr_en: stationDummy.addr_en,
                    lat: stationDummy.lat,
                    lng: stationDummy.lng,
                    type_service: stationDummy.type_service,
                    is24hr: stationDummy.is24hr,
                    servicetime_open: stationDummy.servicetime_open,
                    servicetime_close: stationDummy.servicetime_close,
                    is_service_charge: stationDummy.is_service_charge,
                    service_rate: stationDummy.service_rate,
                    status_approve: 'S',
                    status_msg: stationDummy.status_msg,
                    station_status: stationDummy.station_status,
                    tel: stationDummy.tel,
                    is_service_parking: stationDummy.is_service_parking,
                    is_service_food: stationDummy.is_service_food,
                    is_service_coffee: stationDummy.is_service_coffee,
                    is_service_restroom: stationDummy.is_service_restroom,
                    is_service_shoping: stationDummy.is_service_shoping,
                    is_service_restarea: stationDummy.is_service_restarea,
                    is_service_wifi: stationDummy.is_service_wifi,
                    is_service_other: stationDummy.is_service_other,
                    note: stationDummy.note,
                    power: stationDummy.power,
                    create_by: stationDummy.create_by,
                    pv_id: stationDummy.pv_id,
                    PlugMapping: {
                        createMany: {
                            data: stationDummy.PlugMappingDummy.map((item) => {
                                item.power = item.power.toString()
                                return item
                            })
                        }
                    },
                }
            }

            let createStation = await this.prismaService.station.create(createStationObject)

            await this.prismaService.stationDummy.update({ where: { st_id }, data: { status_approve: "S" } })

            return createStation

        } else {
            throw new NotFoundException("ไม่พบ Station Request")
        }
    }

    async rejectStationDummy(st_id: string) {
        let stationDummy = await this.prismaService.stationDummy.findFirst({
            where: {
                st_id: st_id,
                status_approve: 'W',
                deleted: false,
            },
            include: {
                ProviderMaster: {
                    select: {
                        pv_id: true,
                        logo_label: true,
                        shortname: true,
                        name: true,
                        desv: true,

                        icon: true
                    }
                },
                // Checkin: true,
                PlugMappingDummy: {
                    where: {
                        deleted: false,
                    },
                    select: {
                        p_mapping_id: true,
                        p_type_id: true,
                        qty: true,
                        power: true,
                        PlugTypeMaster: {
                            select: {
                                p_title: true,
                                p_icon: true,
                                p_type_id: true
                            }
                        }
                    }
                }
            }, orderBy: { created_date: "desc" }
        })


        if (stationDummy) {

            let update = await this.prismaService.stationDummy.update({ where: { st_id }, data: { status_approve: "F" } })

            return update

        } else {
            throw new NotFoundException("ไม่พบ Station Request")
        }
    }


    async update(id: string, updateStationDto: CreateUpdateStationDto) {

        let stationCheck = await this.prismaService.station.findFirst({ where: { st_id: id } })

        if (!stationCheck) throw new BadRequestException("station Not found")

        const idDelete = updateStationDto.PlugMapping.filter((val) => (val.del == true)).map((item) => (item.p_mapping_id))

        // console.log(idDelete);


        const filterInsertPlugMapping: Prisma.PlugMappingCreateManyStationInput[] = updateStationDto.PlugMapping.filter((item) => (item.del == false)).map((item) => ({
            qty: item.qty,
            p_type_id: item.p_type_id,
            power: item.power
        }))

        let insertPlugMap: Prisma.PlugMappingCreateManyStationInputEnvelope = {
            data: filterInsertPlugMapping
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
                tel: updateStationDto.tel,
                is_service_parking: updateStationDto.is_service_parking,
                is_service_food: updateStationDto.is_service_food,
                is_service_coffee: updateStationDto.is_service_coffee,
                is_service_restroom: updateStationDto.is_service_restroom,
                is_service_shoping: updateStationDto.is_service_shoping,
                is_service_restarea: updateStationDto.is_service_restarea,
                is_service_wifi: updateStationDto.is_service_wifi,
                is_service_other: updateStationDto.is_service_other,
                status_msg: updateStationDto.status_msg,
                station_status: updateStationDto.station_status,
                // update_by: uid,
                updated_date: new Date(),
                note: updateStationDto.note,
                power: updateStationDto.power,
                pv_id: updateStationDto.pv_id,
                // PlugMapping: {
                //   deleteMany: {
                //     p_mapping_id: {
                //       in: [...idDelete]
                //     }
                //   },
                // }
            },
            where: {
                st_id: id
            },
            include: {
                PlugMapping: true,
                ProviderMaster: true
            }

        }

        if (idDelete.length > 0) {
            await this.prismaService.plugMapping.deleteMany({ where: { p_mapping_id: { in: idDelete } } })
        }


        console.log(objectUpdateStation.data);


        objectUpdateStation.data = removeEmptyObjects(objectUpdateStation.data)

        console.log(objectUpdateStation.data);

        if (filterInsertPlugMapping.length > 0) {
            objectUpdateStation.data['PlugMapping'] = {
                createMany: {
                    data: filterInsertPlugMapping
                }
            }
        }

        if (updateStationDto.station_img) {
            try {
                let strImage = updateStationDto.station_img.replace(/^data:image\/[a-z]+;base64,/, "");
                let buff = Buffer.from(strImage, 'base64');

                let pathFolder = join(__dirname, '..', '..', '..', 'public', "station_img")

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