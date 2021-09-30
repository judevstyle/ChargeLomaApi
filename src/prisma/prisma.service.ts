import { PrismaClient } from '.prisma/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    constructor() {
        super();
    }

    async onModuleInit() {
        await this.$connect();

        const prisma = new PrismaClient({})

        prisma.$use(async (params, next) => {

            if (params.action == 'delete') {
                // Delete queries
                // Change action to an update
                params.action = 'update'
                params.args['data'] = { deleted: true }
            }
            if (params.action == 'deleteMany') {
                // Delete many queries
                params.action = 'updateMany'
                if (params.args.data != undefined) {
                    params.args.data['deleted'] = true
                } else {
                    params.args['data'] = { deleted: true }
                }
            }

            return next(params)
        })

    }

    async onModuleDestroy() {
        await this.$disconnect();
    }


}
