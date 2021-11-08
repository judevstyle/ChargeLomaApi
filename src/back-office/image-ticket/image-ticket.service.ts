import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ImageTicketService {
    constructor(private readonly prismaService: PrismaService) { }

    async findAllTicketImageRequest() {
        return this.prismaService.imageTicket.findMany({
            orderBy: { created_date: "desc" },
            include: {
                ImageTicketBody: {
                    take: 1,
                    orderBy: {
                        ticket_bd_id: 'desc'
                    }
                },
                User: {
                    select: {
                        uid: true,
                        display_name: true,
                        avatar: true,
                    }
                }
            }
        })
    }

    async findOne(ticket_id: number) {
        return this.prismaService.imageTicket.findFirst({
            where: {
                ticket_id
            },
            orderBy: { created_date: "desc" },
            include: {
                ImageTicketBody: true,
                User: {
                    select: {
                        uid: true,
                        display_name: true,
                        avatar: true,
                    }
                }
            }
        })
    }

    async approveTicketImage(ticket_id: number) {
        return this.prismaService.imageTicket.update({ where: { ticket_id }, data: { status_approve: "S" } })
    }

    async rejectTicketImage(ticket_id: number) {
        return this.prismaService.imageTicket.update({ where: { ticket_id }, data: { status_approve: "F" } })
    }
}
