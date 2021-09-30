import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors } from '@nestjs/common';
import { PlugTypeMasterService } from './plug-type-master.service';
import { CreatePlugTypeMasterDto } from './dto/create-plug-type-master.dto';
import { UpdatePlugTypeMasterDto } from './dto/update-plug-type-master.dto';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

@Controller('plug-type-master')
@UseInterceptors(TransformInterceptor)
export class PlugTypeMasterController {
  constructor(private readonly plugTypeMasterService: PlugTypeMasterService) {}

  @Post()
  create(@Body() createPlugTypeMasterDto: CreatePlugTypeMasterDto) {
    return this.plugTypeMasterService.create(createPlugTypeMasterDto);
  }

  @Get()
  findAll() {
    return this.plugTypeMasterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plugTypeMasterService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updatePlugTypeMasterDto: UpdatePlugTypeMasterDto) {
    return this.plugTypeMasterService.update(+id, updatePlugTypeMasterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plugTypeMasterService.remove(+id);
  }
}
