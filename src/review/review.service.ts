import { Prisma } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindAll, FindReviewByUser, FindReviewRecently, PostReview } from './review.dto';
import * as fileType from 'file-type'
import * as fs from 'fs'
import { join } from 'path';
import { removeEmptyObjects } from 'src/helper/object';
import { pagination, ParameterPagination } from 'src/helper/pagination';
import * as lodash from 'lodash'
@Injectable()
export class ReviewService {
    constructor(private readonly prismaService: PrismaService) { }

    async postReview(uid: string, body: PostReview) {
        let checkStation = await this.prismaService.station.findFirst({ where: { st_id: body.st_id } })

        if (!checkStation) {
            throw new BadRequestException("Station Not found")
        } else {
            let objectPostReview: Prisma.CheckinCreateArgs = {
                data: {
                    power: body.power,
                    st_id: body.st_id,
                    isCharge: body.isCharge,
                    create_by: uid,
                    comment: body.comment,
                    car_serve: body.car_serve,
                    ReviewImg: {
                        createMany: {
                            data: []
                        }
                    }
                },
                include: {
                    ReviewImg: true
                }
            }

            let saveReviewImage: Prisma.ReviewImgCreateManyCheckInInput[] = []

            for await (const iterator of body.review_img) {
                try {
                    let strImage = iterator.img_base64.replace(/^data:image\/[a-z]+;base64,/, "");
                    let buff = Buffer.from(strImage, 'base64');

                    let pathFolder = join(__dirname, '..', '..', 'public', "review_img")

                    let getfileType = await fileType.fromBuffer(buff)
                    let nameFiles = `${Date.now()}_reviewimg.${getfileType.ext}`;
                    fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

                    saveReviewImage.push({
                        // update_by:uid,
                        create_by: uid,
                        st_id: body.st_id,
                        img_path: process.env.API_URL + "/review_img/" + nameFiles
                    })
                    // objectCreatePlugTypeMaster.p_icon = process.env.API_URL + "/review_img/" + nameFiles
                } catch (error) {
                    console.log(error);

                }
            }

            if (saveReviewImage.length > 0) {
                objectPostReview.data['ReviewImg']['createMany'] = {
                    data: saveReviewImage
                }
            }

            let review = await this.prismaService.checkin.create(objectPostReview)

            return review
        }
    }

    async updateReview(uid: string, body: PostReview, ck_id: number) {
        let checkStation = await this.prismaService.station.findFirst({ where: { st_id: body.st_id } })
        let checkReview = await this.prismaService.checkin.findFirst({ where: { ck_id: ck_id, create_by: uid } })

        if (!checkReview) {
            throw new BadRequestException("Your Checkin not found")
        }

        if (!checkStation) {
            throw new BadRequestException("Station Not found")
        } else {
            let objectPostReview: Prisma.CheckinUpdateArgs = {
                where: {
                    ck_id: ck_id
                },
                data: {
                    power: body.power,
                    st_id: body.st_id,
                    isCharge: body.isCharge,
                    create_by: uid,
                    comment: body.comment,
                    car_serve: body.car_serve,
                    ReviewImg: {
                        createMany: {
                            data: []
                        },
                        deleteMany: {
                            id_img: { in: [] }
                        }
                    }
                },
                include: {
                    ReviewImg: true
                }
            }

            objectPostReview.data = removeEmptyObjects(objectPostReview.data)

            const idDelete = body.review_img.filter((val) => (val.del == true)).map((item) => (+item.id_img))

            const filterImageReview = body.review_img.filter((item) => (item.del == false))


            // if(filterImageReview.length>0){
            //     objectUpdateStation.data.PlugMapping.createMany = insertPlugMap
            //   }


            let saveReviewImage: Prisma.ReviewImgCreateManyCheckInInput[] = []

            for await (const iterator of filterImageReview) {
                try {
                    let strImage = iterator.img_base64.replace(/^data:image\/[a-z]+;base64,/, "");
                    let buff = Buffer.from(strImage, 'base64');

                    let pathFolder = join(__dirname, '..', '..', 'public', "review_img")

                    let getfileType = await fileType.fromBuffer(buff)
                    let nameFiles = `${Date.now()}_reviewimg.${getfileType.ext}`;
                    fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

                    saveReviewImage.push({
                        // update_by:uid,
                        create_by: uid,
                        st_id: body.st_id,
                        img_path: process.env.API_URL + "/review_img/" + nameFiles
                    })
                    // objectCreatePlugTypeMaster.p_icon = process.env.API_URL + "/review_img/" + nameFiles
                } catch (error) {
                    console.log(error);

                }
            }

            if (saveReviewImage.length > 0) {
                objectPostReview.data['ReviewImg']['createMany'] = {
                    data: saveReviewImage
                }
            }

            if (idDelete.length > 0) {
                objectPostReview.data['ReviewImg']['deleteMany'] = {
                    id_img: { in: idDelete }
                }
            }

            let review = await this.prismaService.checkin.update(objectPostReview)

            return review
        }
    }

    async getReview(query: FindAll) {

        let countReview = await this.prismaService.checkin.count({
            where: {
                st_id: query.st_id
            },
        })
        let review = await this.prismaService.checkin.findMany({
            where: {
                st_id: query.st_id
            },
            select: {
                comment: true,
                power: true,
                isCharge: true,
                car_serve: true,
                created_date: true,
                Station: {
                    select: {
                        station_status: true,
                        PlugMapping: {
                            select: {
                                PlugTypeMaster: {
                                    select: {
                                        p_title: true,
                                        p_icon: true
                                    }
                                }
                            }
                        }
                    }
                },
                ReviewImg: {
                    select: {
                        id_img: true,
                        img_path: true
                    }
                },
                User: {
                    select: {
                        uid: true,
                        display_name: true,
                        avatar: true,
                        car:true,
                        email: true
                    }
                }
            },
            skip: (+query.page - 1) * +query.limit,
            take: +query.limit,
            orderBy: {
                created_date: "desc"
            }

        })

        review = review.map((item) => {
            item['plug_type'] = item.Station.PlugMapping.reduce((acc, cur) => {

                acc = [...acc, cur.PlugTypeMaster]
                acc = lodash.uniq(acc)

                return acc
            }, [])
            item['station_status'] = item.Station.station_status

            delete item.Station
            return item
        })

        let paramPagination: ParameterPagination = {
            data: review,
            page: +query.page,
            limit: query.limit,
            responseFrom: "DB",
            totalItems: countReview
        }

        return pagination(paramPagination)
    }

    async getReviewByUser(query: FindReviewByUser) {

        let countReview = await this.prismaService.checkin.count({
            where: {
                create_by: query.uid
            },
        })
        let review = await this.prismaService.checkin.findMany({
            where: {
                create_by: query.uid
            },
            select: {
                comment: true,
                power: true,
                isCharge: true,
                car_serve: true,
                created_date: true,
                ReviewImg: {
                    select: {
                        id_img: true,
                        img_path: true
                    }
                },
                Station: {
                    select: {
                        st_id: true,
                        station_name_th: true,
                        station_name_en: true,
                        station_status: true,
                        PlugMapping: {
                            select: {
                                PlugTypeMaster: {
                                    select: {
                                        p_title: true,
                                        p_icon: true
                                    }
                                }
                            }
                        }
                    }
                },
                User: {
                    select: {
                        uid: true,
                        display_name: true,
                        avatar: true,
                        car:true,
                        email: true
                    }
                }
            },
            skip: (+query.page - 1) * +query.limit,
            take: +query.limit,
            orderBy: {
                created_date: "desc"
            }

        })

        review = review.map((item) => {
            item['plug_type'] = item.Station.PlugMapping.reduce((acc, cur) => {

                acc = [...acc, cur.PlugTypeMaster]
                acc = lodash.uniq(acc)

                return acc
            }, [])

            item['station'] = {
                st_id: item.Station.st_id,
                station_name: query.lang == 'th' ? item.Station.station_name_th : item.Station.station_name_en
            }
            item['station_status'] = item.Station.station_status

            delete item.Station
            
            return item
        })

        let paramPagination: ParameterPagination = {
            data: review,
            page: +query.page,
            limit: query.limit,
            responseFrom: "DB",
            totalItems: countReview
        }

        return pagination(paramPagination)
    }

    async getReviewRecently(query: FindReviewRecently) {

        let countReview = await this.prismaService.checkin.count({})

        let review = await this.prismaService.checkin.findMany({
            select: {
                comment: true,
                power: true,
                isCharge: true,
                car_serve: true,
                created_date: true,
                Station: {
                    select: {
                        st_id: true,
                        station_name_th: true,
                        station_name_en: true,
                        station_status: true,
                        PlugMapping: {
                            select: {
                                PlugTypeMaster: {
                                    select: {
                                        p_title: true,
                                        p_icon: true
                                    }
                                }
                            }
                        }
                    }
                },
                ReviewImg: {
                    select: {
                        id_img: true,
                        img_path: true
                    }
                },
                User: {
                    select: {
                        uid: true,
                        display_name: true,
                        avatar: true,
                        car:true,
                        email: true
                    }
                }
            },
            skip: (+query.page - 1) * +query.limit,
            take: +query.limit,
            orderBy: {
                created_date: "desc"
            }

        })

        review = review.map((item) => {
            item['plug_type'] = item.Station.PlugMapping.reduce((acc, cur) => {

                acc = [...acc, cur.PlugTypeMaster]
                acc = lodash.uniq(acc)

                return acc
            }, [])

            item['station'] = {
                st_id: item.Station.st_id,
                station_name: query.lang == 'th' ? item.Station.station_name_th : item.Station.station_name_en
            }
            item['station_status'] = item.Station.station_status

            delete item.Station
            return item
        })

        let paramPagination: ParameterPagination = {
            data: review,
            page: +query.page,
            limit: query.limit,
            responseFrom: "DB",
            totalItems: countReview
        }

        return pagination(paramPagination)
    }

    async getTopReviewer() {
        const topReview = await this.prismaService.checkin.groupBy({
            by: ['create_by'],
            _count: {
                create_by: true
            },
            orderBy: {
                _count: {
                    create_by: 'desc'
                }
            },
            take: 20
        })

        const users = await this.prismaService.user.findMany({
            where: {
                uid: { in: topReview.map((item) => (item.create_by)) }
            },
            select: {
                uid: true,
                display_name: true,
                avatar: true,
                car:true,
                email: true
            }
        })


        let result = users.map((item) => {
            const findCountReview = topReview.find((countReview) => (countReview.create_by == item.uid))

            return {
                countReview: findCountReview._count.create_by,
                User: {
                    ...item
                }
            }
        })

        result = lodash.orderBy(result,"countReview",'desc')

        return result
    }
}
