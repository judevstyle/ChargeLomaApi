import { Prisma } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePlugTypeMasterDto } from './dto/create-plug-type-master.dto';
import { UpdatePlugTypeMasterDto } from './dto/update-plug-type-master.dto';
import * as fileType from 'file-type'
import * as fs from 'fs'
import { join } from 'path';

@Injectable()
export class PlugTypeMasterService {

  constructor(private prismaService: PrismaService) { }

  async create(createPlugTypeMasterDto: CreatePlugTypeMasterDto) {

    let objectCreatePlugTypeMaster: Prisma.PlugTypeMasterCreateInput = {
      p_title: createPlugTypeMasterDto.p_title
    }

    if (createPlugTypeMasterDto.p_icon.indexOf("base64") !== -1) {

      let strImage = createPlugTypeMasterDto.p_icon.replace(/^data:image\/[a-z]+;base64,/, "");
      let buff = Buffer.from(strImage, 'base64');

      let pathFolder = join(__dirname, '..', '..', '..', 'public', "plug_type_icon_img")

      let getfileType = await fileType.fromBuffer(buff)
      let nameFiles = `${Date.now()}_icon.${getfileType.ext}`;
      fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

      objectCreatePlugTypeMaster.p_icon = nameFiles
    }


    let plugTypeMaster = await this.prismaService.plugTypeMaster.create({
      data: objectCreatePlugTypeMaster
    })

    return plugTypeMaster;
  }

  async findAll() {
    let plugTypeMaster = await this.prismaService.plugTypeMaster.findMany({ orderBy: { created_date: 'desc' }, where: { deleted: false } })
    return plugTypeMaster;
  }

  async findOne(id: number) {
    let plugTypeMaster = await this.prismaService.plugTypeMaster.findFirst({ where: { p_type_id: id, deleted: false } })
    return plugTypeMaster;
  }

  async update(id: number, updatePlugTypeMasterDto: UpdatePlugTypeMasterDto) {
    let objectCreatePlugTypeMaster: Prisma.PlugTypeMasterUpdateInput = {
      p_title: updatePlugTypeMasterDto.p_title,
      updated_date: new Date()
    }

    if (updatePlugTypeMasterDto?.p_icon.indexOf("base64") !== -1) {

      let strImage = updatePlugTypeMasterDto.p_icon.replace(/^data:image\/[a-z]+;base64,/, "");
      let buff = Buffer.from(strImage, 'base64');

      let pathFolder = join(__dirname, '..', '..', '..', 'public', "plug_type_icon_img")

      let getfileType = await fileType.fromBuffer(buff)
      let nameFiles = `${Date.now()}_icon.${getfileType.ext}`;
      fs.writeFileSync(pathFolder + "/" + nameFiles, buff);

      objectCreatePlugTypeMaster.p_icon = nameFiles
    }


    let plugTypeMaster = await this.prismaService.plugTypeMaster.update({
      data: objectCreatePlugTypeMaster,
      where: {
        p_type_id: id
      }
    })

    return plugTypeMaster;
  }

  async remove(id: number) {
    let plugTypeMaster = await this.prismaService.plugTypeMaster.delete({
      where: {
        p_type_id: id
      }
    })

    return plugTypeMaster;
  }
}
