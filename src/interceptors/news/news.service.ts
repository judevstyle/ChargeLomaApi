import { Injectable } from '@nestjs/common';
import { pagination, ParameterPagination } from 'src/helper/pagination';
import { PrismaService } from 'src/prisma/prisma.service';
import { FindNews } from './news.dto';

@Injectable()
export class NewsService {
    constructor(private prismaService: PrismaService) { }

    async findAllNews(query: FindNews) {
        let news = await this.prismaService.news.findMany({
            orderBy: { create_by: 'desc' },
            skip: (+query.page - 1) * +query.limit,
            take: +query.limit,
        })

        let countNews = await this.prismaService.news.count({})

        let paramPagination: ParameterPagination = {
            data: news,
            page: +query.page,
            limit: query.limit,
            responseFrom: "DB",
            totalItems: countNews
        }

        return pagination(paramPagination)
    }
}
