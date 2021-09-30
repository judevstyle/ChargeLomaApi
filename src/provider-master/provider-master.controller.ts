import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Put } from '@nestjs/common';
import { ProviderMasterService } from './provider-master.service';
import { CreateProviderMasterDto } from './dto/create-provider-master.dto';
import { UpdateProviderMasterDto } from './dto/update-provider-master.dto';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

@Controller('provider-master')
@UseInterceptors(TransformInterceptor)
export class ProviderMasterController {
  constructor(private readonly providerMasterService: ProviderMasterService) {}

  @Post()
  create(@Body() createProviderMasterDto: CreateProviderMasterDto) {
    return this.providerMasterService.create(createProviderMasterDto);
  }

  @Get()
  findAll() {
    return this.providerMasterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.providerMasterService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateProviderMasterDto: UpdateProviderMasterDto) {
    return this.providerMasterService.update(+id, updateProviderMasterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.providerMasterService.remove(+id);
  }
}
