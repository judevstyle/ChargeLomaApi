import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MemberService {
    constructor(private readonly prismaService: PrismaService) { }

    findAllMember(search: string) {
        return this.prismaService.user.findMany({
            where: {
                OR: [
                    {
                        uid: { contains: search }
                    },
                    {
                        display_name: { contains: search }
                    },
                    {
                        email: { contains: search }
                    },
                    {
                        tel: { contains: search }
                    }
                ]
            },
            orderBy: {
                created_date: 'desc',
            },
            select: {
                uid: true,
                type_user: true,
                display_name: true,
                tel: true,
                email: true,
                car: true,
                avatar: true,
                created_date: true,
            }
        })
    }
}
