import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fileType from 'file-type'
import * as fs from 'fs'
import { join } from 'path';
import { Prisma } from '.prisma/client';
import { removeEmptyObjects } from 'src/helper/object';
import { CreateUpdateStationDto } from '../dto/station.dto';
import { CreateUpdateProviderMasterDto } from '../dto/provider-master.dto';

@Injectable()
export class ProviderMasterService {
  constructor(private prismaService: PrismaService) { }

  async create(createProviderMasterDto: CreateUpdateProviderMasterDto) {

    let objectCreateProviderMaster: Prisma.ProviderMasterCreateInput = {
      name: createProviderMasterDto.name,
      desv: createProviderMasterDto.desv,
      shortname: createProviderMasterDto.shortname,
      //   create_by:uid
    }

    objectCreateProviderMaster = removeEmptyObjects(objectCreateProviderMaster)


    if (createProviderMasterDto.icon) {
      try {
        let strImage = createProviderMasterDto.icon.replace(/^data:image\/[a-z]+;base64,/, "");
        let buff = Buffer.from(strImage, 'base64');

        let pathFolder = join(__dirname,'..' ,'..', '..', 'public', "provider_icon_img")

        let getfileType = await fileType.fromBuffer(buff)
        let nameFiles = `${Date.now()}_icon.${getfileType.ext}`;
        fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

        objectCreateProviderMaster.icon =  "/provider_icon_img/" + nameFiles
      } catch (error) {

      }

    }

    if (createProviderMasterDto.logo_label) {
      try {
        let strImage = createProviderMasterDto.logo_label.replace(/^data:image\/[a-z]+;base64,/, "");
        let buff = Buffer.from(strImage, 'base64');

        let pathFolder = join(__dirname, '..','..', '..', 'public', "logo_label_img")

        let getfileType = await fileType.fromBuffer(buff)
        let nameFiles = `${Date.now()}_logo_label.${getfileType.ext}`;
        fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

        objectCreateProviderMaster.logo_label =  "/logo_label_img/" + nameFiles
      } catch (error) {

      }

    }

    const providerMaster = await this.prismaService.providerMaster.create({
      data: objectCreateProviderMaster
    })

    return providerMaster
  }

  async findAll(search: string) {
    const providerMaster = await this.prismaService.providerMaster.findMany({
      where: {
        OR: [
          {
            name: { contains: search },
            desv: { contains: search }
          }
        ]
      },
      orderBy: { updated_date: 'asc' }
    })
    return providerMaster
  }

  async findOne(id: number) {
    const providerMaster = await this.prismaService.providerMaster.findFirst({ where: { pv_id: id, deleted: false } })
    return providerMaster
  }

  async update(id: number, updateProviderMasterDto: CreateUpdateProviderMasterDto) {
    let objectCreateProviderMaster: Prisma.ProviderMasterUpdateInput = {
      name: updateProviderMasterDto.name,
      desv: updateProviderMasterDto.desv,
      shortname: updateProviderMasterDto.shortname,
      //   update_by:uid,
      updated_date: new Date()
    }

    objectCreateProviderMaster = removeEmptyObjects(objectCreateProviderMaster)

    if (updateProviderMasterDto.icon) {

      try {
        let strImage = updateProviderMasterDto.icon.replace(/^data:image\/[a-z]+;base64,/, "");
        let buff = Buffer.from(strImage, 'base64');

        let pathFolder = join(__dirname, '..', '..', '..', 'public', "provider_icon_img")

        let getfileType = await fileType.fromBuffer(buff)
        let nameFiles = `${Date.now()}_icon.${getfileType.ext}`;
        fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

        objectCreateProviderMaster.icon =  "/provider_icon_img/" + nameFiles
      } catch (error) {
        objectCreateProviderMaster.icon = updateProviderMasterDto.icon
        console.log(error);
      }


    }

    if (updateProviderMasterDto.logo_label) {
      try {
        let strImage = updateProviderMasterDto.logo_label.replace(/^data:image\/[a-z]+;base64,/, "");
        let buff = Buffer.from(strImage, 'base64');

        let pathFolder = join(__dirname, '..', '..', '..', 'public', "logo_label_img")

        let getfileType = await fileType.fromBuffer(buff)
        let nameFiles = `${Date.now()}_logo_label.${getfileType.ext}`;
        fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

        objectCreateProviderMaster.logo_label =  "/logo_label_img/" + nameFiles
      } catch (error) {
        objectCreateProviderMaster.logo_label = updateProviderMasterDto.logo_label
      }

    }

    const providerMaster = await this.prismaService.providerMaster.update({
      data: objectCreateProviderMaster,
      where: { pv_id: id }
    })

    return providerMaster
  }

  async remove(id: number) {
    const providerMaster = await this.prismaService.providerMaster.delete({ where: { pv_id: id } })
    return providerMaster
  }
}
