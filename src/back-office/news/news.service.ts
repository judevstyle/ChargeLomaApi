import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUpdateNews } from '../dto/news.dto';
import * as fileType from 'file-type'
import * as fs from 'fs'
import { join } from 'path';

@Injectable()
export class NewsService {
    constructor(private readonly prismaService: PrismaService) { }


    async findAll() {
        return this.prismaService.news.findMany({ orderBy: { created_date: 'desc' } })
    }

    async findOne(id: number) {
        return this.prismaService.news.findFirst({ where: { news_id: id } })
    }

    async create(body: CreateUpdateNews) {
        let newsObjectCreate: Prisma.NewsCreateInput = {
            title: body.title,
            desc: body.desc
        }

        if (body.image) {

            try {
                let strImage = body.image.replace(/^data:image\/[a-z]+;base64,/, "");
                let buff = Buffer.from(strImage, 'base64');

                let pathFolder = join(__dirname, '..', '..', '..', 'public', "news_img")

                let getfileType = await fileType.fromBuffer(buff)
                let nameFiles = `${Date.now()}_news.${getfileType.ext}`;
                fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

                newsObjectCreate['image'] = process.env.API_URL + "/news_img/" + nameFiles
            } catch (error) {
                console.log(error);

            }

        }
        let news = await this.prismaService.news.create({
            data: newsObjectCreate
        })

        return news;
    }

    async update(id: number, body: CreateUpdateNews) {
        let newsObjectUpdate: Prisma.NewsUpdateInput = {
            title: body.title,
            desc: body.desc
        }

        if (body.image) {

            try {
                let strImage = body.image.replace(/^data:image\/[a-z]+;base64,/, "");
                let buff = Buffer.from(strImage, 'base64');

                let pathFolder = join(__dirname, '..', '..', '..', 'public', "news_img")

                let getfileType = await fileType.fromBuffer(buff)
                let nameFiles = `${Date.now()}_news.${getfileType.ext}`;
                fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

                newsObjectUpdate['image'] = process.env.API_URL + "/news_img/" + nameFiles
            } catch (error) {
                console.log(error);

            }

        }
        let news = await this.prismaService.news.update({
            where: { news_id: id },
            data: newsObjectUpdate
        })

        return news;
    }

    async remove(id: number) {
        return this.prismaService.news.delete({ where: { news_id: id } })
    }
}
