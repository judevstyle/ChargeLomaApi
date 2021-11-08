import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterBackOfficeDTO } from '../dto/register-back-office.dto';
import { JwtService } from '@nestjs/jwt';
import { hash, compare, genSalt } from 'bcrypt';
import { LoginBackOfficeDTO } from '../dto/login-back-office.dto';

@Injectable()
export class AuthBackoffice {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) { }

    async register(body: RegisterBackOfficeDTO) {
        const { username, password } = body
        const salt = await genSalt(10);

        const hashedPassword = await hash(password, salt);

        let superAdmin = await this.prismaService.superAdmin.create({
            data: {
                username,
                password: hashedPassword
            }
        })

        return superAdmin
    }

    async login(body: LoginBackOfficeDTO) {
        const superadmin = await this.prismaService.superAdmin.findFirst({ where: { username: body.username } })

        if (!superadmin) {
            throw new BadRequestException('ไม่พบผู้ใช้นี้ในระบบ');
        }

        const isValid = await compare(body.password, superadmin.password);
        if (!isValid) {
            throw new BadRequestException('รหัสผ่านไม่ถูกต้อง');
        }

        const token = await this.jwtService.signAsync({ username: body.username });

        delete superadmin.password

        return {
            tokenType: 'Bearer',
            accessToken: token,
            userData: { ...superadmin }
        }
    }

    async checkAuth(superadmin_username: string) {
        return this.prismaService.superAdmin.findFirst({
            where: { username: superadmin_username }, select: {
                username: true,
                super_admin_id: true
            }
        })
    }
}
