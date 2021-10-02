import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProviderMasterDto } from './dto/create-provider-master.dto';
import { UpdateProviderMasterDto } from './dto/update-provider-master.dto';
import * as fileType from 'file-type'
import * as fs from 'fs'
import { join } from 'path';
import { Prisma } from '.prisma/client';

@Injectable()
export class ProviderMasterService {

  constructor(private prismaService: PrismaService) { }

  async create(createProviderMasterDto: CreateProviderMasterDto) {

    let objectCreateProviderMaster: Prisma.ProviderMasterCreateInput = {
      name: createProviderMasterDto.name,
      desv: createProviderMasterDto.desv
    }

    if (createProviderMasterDto.icon) {
      try {
        let strImage = createProviderMasterDto.icon.replace(/^data:image\/[a-z]+;base64,/, "");
        let buff = Buffer.from(strImage, 'base64');

        let pathFolder = join(__dirname, '..', '..', 'public', "provider_icon_img")

        let getfileType = await fileType.fromBuffer(buff)
        let nameFiles = `${Date.now()}_icon.${getfileType.ext}`;
        fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

        objectCreateProviderMaster.icon = process.env.API_URL + "/provider_icon_img/" + nameFiles
      } catch (error) {

      }

    }

    const providerMaster = await this.prismaService.providerMaster.create({
      data: objectCreateProviderMaster
    })

    return providerMaster
  }

  async findAll() {
    const providerMaster = await this.prismaService.providerMaster.findMany({ orderBy: { created_date: 'desc' }, where: { deleted: false } })
    return providerMaster
  }

  async findOne(id: number) {
    const providerMaster = await this.prismaService.providerMaster.findFirst({ where: { pv_id: id, deleted: false } })
    return providerMaster
  }

  async update(id: number, updateProviderMasterDto: UpdateProviderMasterDto) {
    let objectCreateProviderMaster: Prisma.ProviderMasterUpdateInput = {
      name: updateProviderMasterDto.name,
      desv: updateProviderMasterDto.desv
    }

    if (updateProviderMasterDto.icon) {

      try {
        let strImage = updateProviderMasterDto.icon.replace(/^data:image\/[a-z]+;base64,/, "");
        let buff = Buffer.from(strImage, 'base64');

        let pathFolder = join(__dirname, '..', '..', 'public', "provider_icon_img")

        let getfileType = await fileType.fromBuffer(buff)
        let nameFiles = `${Date.now()}_icon.${getfileType.ext}`;
        fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

        objectCreateProviderMaster.icon = process.env.API_URL + "/provider_icon_img/" + nameFiles
      } catch (error) {
        console.log(error);
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
