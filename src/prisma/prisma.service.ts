import { PrismaClient } from '.prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as _ from 'lodash'
import { removeDeleteRow } from 'src/helper/object';

const prisma = new PrismaClient({})

const hasDeleteModel = [
    "User",
    "ImageTicket",
    "Checkin",
    "ReviewImg",
    "ImageTicketBody",
    "FavoriteStation",
    "Station",
    "StationDummy",
    "ProviderMaster",
    "PlugMapping",
    "PlugMappingDummy",
    "PlugTypeMaster"
]

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor() {
        super();
    }

    async onModuleInit() {
        await this.$connect();

        this.$use(async (params, next) => {
            const checkDeleteModel = hasDeleteModel.find((item)=>item==params.model)

            // console.log(params.model);
            

            if (params.action == 'delete' && checkDeleteModel) {
                // Delete queries
                // Change action to an update
                params.action = 'update'
                params.args['data'] = { deleted: true }
            }
            if (params.action == 'deleteMany' && checkDeleteModel) {
                // Delete many queries
                params.action = 'updateMany'
                if (params.args.data != undefined) {
                    params.args.data['deleted'] = true
                } else {
                    params.args['data'] = { deleted: true }
                }
            }

            // if (params.action == 'findMany' || params.action == 'findFirst') {
            //     // Find many queries
            //     if (params.args.where != undefined) {
            //       if (params.args.where.deleted == undefined) {
            //         // Exclude deleted records if they have not been expicitly requested
            //         params.args.where['deleted'] = false
            //       }
            //     } else {
            //       params.args['where'] = { deleted: false }
            //     }
            //   }

            const checkHasDelete = hasDeleteModel.find((item) => (item == params.model))

            // if (!params.args.where?.deleted && checkHasDelete && (params.action == 'findMany' || params.action == 'findFirst')) {
            //     params.args.where['deleted'] = false
            // }

            if ((params.action == 'findUnique' || params.action == 'findFirst') && checkDeleteModel) {
                // Change to findFirst - you cannot filter
                // by anything except ID / unique with findUnique
                params.action = 'findFirst'
                // Add 'deleted' filter
                // ID filter maintained
                params.args.where['deleted'] = false
            }
            if (params.action == 'findMany' && checkDeleteModel) {
                // Find many queries
                if (params.args.where != undefined) {
                    if (params.args.where.deleted == undefined) {
                        // Exclude deleted records if they have not been expicitly requested
                        params.args.where['deleted'] = false
                    }
                } else {
                    params.args['where'] = { deleted: false }
                }
            }

            let queryResult = await next(params);

            // console.log(queryResult);
            if(queryResult)
            queryResult = removeDeleteRow(queryResult)
         
            return queryResult
            // return next(params)
        })
    }


    async onModuleDestroy() {
        await this.$disconnect();
    }


}
