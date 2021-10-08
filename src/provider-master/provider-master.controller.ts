import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Put, UseGuards, Request } from '@nestjs/common';
import { ProviderMasterService } from './provider-master.service';
import { CreateProviderMasterDto } from './dto/create-provider-master.dto';
import { UpdateProviderMasterDto } from './dto/update-provider-master.dto';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { AuthGuard } from '@nestjs/passport';

@Controller('provider-master')
@UseInterceptors(TransformInterceptor)
export class ProviderMasterController {
  constructor(private readonly providerMasterService: ProviderMasterService) {}

  @Post()
  @UseGuards(AuthGuard(['admin']))
  create(@Body() createProviderMasterDto: CreateProviderMasterDto,@Request() req) {
    const USER = req.user
    return this.providerMasterService.create(USER.uid,createProviderMasterDto);
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
  @UseGuards(AuthGuard(['admin']))
  update(@Param('id') id: string, @Body() updateProviderMasterDto: UpdateProviderMasterDto,@Request() req) {
    const USER = req.user
    return this.providerMasterService.update(+id, updateProviderMasterDto,USER.uid);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(['admin']))
  remove(@Param('id') id: string) {
    return this.providerMasterService.remove(+id);
  }
}
