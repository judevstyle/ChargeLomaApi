import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { getFolderDate, pad } from 'src/helper/util';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostImageTicket } from './image-ticket.dto';
import * as fileType from 'file-type'
import * as fs from 'fs'
import { join } from 'path';
@Injectable()
export class ImageTicketService {

    constructor(private readonly prismaService: PrismaService) { }

    async postImageTicket(uid: string, body: PostImageTicket) {

        let runningTicket = await this.prismaService.imageTicketBody.count() + 1


        let objectCreateImageTicket: Prisma.ImageTicketCreateArgs = {
            data: {
                status_approve: "W",
                uid: uid,
                create_by: uid,
                st_id: body.st_id,
                status_msg: body.status_msg,
                ticket_no: `${getFolderDate()}${pad(runningTicket, 3)}`,
                ImageTicketBody: { createMany: { data: [] } }
            },
            include: {
                ImageTicketBody: true
            }
        }

        let images: Prisma.ImageTicketBodyCreateManyImageTicketInput[] = []


        for await (const iterator of body.img) {
            try {
                let strImage = iterator.img_base64.replace(/^data:image\/[a-z]+;base64,/, "");
                let buff = Buffer.from(strImage, 'base64');

                let pathFolder = join(__dirname, '..', '..', 'public', "image_ticket_img")

                let getfileType = await fileType.fromBuffer(buff)
                let nameFiles = `${Date.now()}_imageTicket.${getfileType.ext}`;
                fs.writeFileSync(pathFolder + "/" + nameFiles, buff);
                images.push({
                    img_path:  "/image_ticket_img/" + nameFiles
                })
                // objectCreatePlugTypeMaster.p_icon =  "/review_img/" + nameFiles
            } catch (error) {
                console.log(error);

            }
        }

        if (images.length > 0) {
            objectCreateImageTicket.data.ImageTicketBody.createMany.data = images
        }

        return await this.prismaService.imageTicket.create(objectCreateImageTicket)

    }
}
