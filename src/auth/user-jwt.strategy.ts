import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy,'user') {
    constructor(private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_SECRET_KEY,
        });
    }

    async validate(payload: any) {
        const user = await this.prismaService.user.findUnique({
            where: { uid: payload.uid },
        });
        if (!user) {
            throw new NotFoundException('ไม่พบข้อมูลผู้ใช้นี้');
        }
        return {
            ...user
        };

    }
}