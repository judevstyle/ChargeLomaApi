import { Prisma } from '.prisma/client';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDTO, RegisterDTO, UpdateProfileDTO } from './dto/user.dto';
import * as fileType from 'file-type'
import * as fs from 'fs'
import { join } from 'path';
import { removeEmptyObjects } from 'src/helper/object';


@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async register(body: RegisterDTO) {
        const checkExistUid = await this.prismaService.user.findFirst({
            where: { uid: body.uid },
            select: {
                uid: true,
                email: true,
                tel: true,
                avatar: true,
                display_name: true,
                car:true,
                type_user: true
            }

        })

        if (checkExistUid) {
            const token = await this.jwtService.signAsync({ uid: checkExistUid.uid });

            return {
                tokenType: 'Bearer',
                token: token,
                user: { ...checkExistUid }
            }
        } else {

            let objectUserCreate: Prisma.UserCreateArgs = {
                data: {
                    uid: body.uid,
                    email: body.email,
                    display_name: body.display_name,
                    car:body.car,
                    tel: body.tel,
                    type_user: 'user'
                },
                select: {
                    uid: true,
                    email: true,
                    tel: true,
                    car:true,
                    avatar: true,
                    display_name: true,
                    type_user: true
                }

            }

            if (body?.avatar) {

                try {
                    let strImage = body.avatar.replace(/^data:image\/[a-z]+;base64,/, "");
                    let buff = Buffer.from(strImage, 'base64');

                    let pathFolder = join(__dirname, '..', '..', 'public', "user_img")

                    let getfileType = await fileType.fromBuffer(buff)
                    let nameFiles = `${Date.now()}_user.${getfileType.ext}`;
                    fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

                    objectUserCreate.data.avatar = process.env.API_URL + "/user_img/" + nameFiles
                } catch (error) {
                    objectUserCreate.data.avatar = body.avatar
                    console.log(error);

                }


            }



            const user = await this.prismaService.user.create(objectUserCreate)

            const token = await this.jwtService.signAsync({ uid: user.uid });

            return {
                tokenType: 'Bearer',
                token: token,
                user: { ...user }
            }
        }
    }

    async updateProfile(uid: string, body: UpdateProfileDTO) {
        let objectUserUpdate: Prisma.UserUpdateArgs = {
            where: { uid },
            data: {
                // uid: body.uid,
                email: body.email,
                display_name: body.display_name,
                car:body.car,
                tel: body.tel
            },
            select: {
                uid: true,
                email: true,
                tel: true,
                avatar: true,
                display_name: true,
                type_user: true
            }

        }

        objectUserUpdate.data = removeEmptyObjects(objectUserUpdate.data)

        if (body?.avatar) {

            try {
                let strImage = body.avatar.replace(/^data:image\/[a-z]+;base64,/, "");
                let buff = Buffer.from(strImage, 'base64');

                let pathFolder = join(__dirname, '..', '..', 'public', "user_img")

                let getfileType = await fileType.fromBuffer(buff)
                let nameFiles = `${Date.now()}_user.${getfileType.ext}`;
                fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

                objectUserUpdate.data.avatar = process.env.API_URL + "/user_img/" + nameFiles
            } catch (error) {
                console.log(error);
                objectUserUpdate.data.avatar = body.avatar
            }
        }
        const user = await this.prismaService.user.update(objectUserUpdate)

        // const token = await this.jwtService.signAsync({ uid: user.uid });

        return user

    }

    async profile(uid: string) {
        const user = await this.prismaService.user.findFirst({
            where: { uid: uid },
            select: {
                uid: true,
                car:true,
                email: true,
                tel: true,
                avatar: true,
                display_name: true,
                type_user: true
            }

        })

        return user
    }

    async auth(body: LoginDTO) {
        const checkExistUid = await this.prismaService.user.findFirst({
            where: { uid: body.uid },
            select: {
                uid: true,
                email: true,
                car:true,
                tel: true,
                avatar: true,
                display_name: true,
                type_user: true
            }

        })

        if (checkExistUid) {
            const token = await this.jwtService.signAsync({ uid: checkExistUid.uid });

            return {
                tokenType: 'Bearer',
                token: token,
                user: { ...checkExistUid }
            }
        } else {
            throw new BadRequestException("ไม่พบ User จาก uid นี้")
        }
    }

}
