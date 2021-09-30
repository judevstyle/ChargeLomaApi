import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProviderMasterDto } from './dto/create-provider-master.dto';
import { UpdateProviderMasterDto } from './dto/update-provider-master.dto';
import * as fileType from 'file-type'
import * as fs from 'fs'
import { join } from 'path';

@Injectable()
export class ProviderMasterService {

  constructor(private prismaService: PrismaService) { }

  create(createProviderMasterDto: CreateProviderMasterDto) {

    return 'This action adds a new providerMaster';
  }

  async findAll() {
    const providerMaster = await this.prismaService.providerMaster.findMany({})
    return providerMaster
  }

  findOne(id: number) {
    return `This action returns a #${id} providerMaster`;
  }

  update(id: number, updateProviderMasterDto: UpdateProviderMasterDto) {
    return `This action updates a #${id} providerMaster`;
  }

  remove(id: number) {
    return `This action removes a #${id} providerMaster`;
  }
}
