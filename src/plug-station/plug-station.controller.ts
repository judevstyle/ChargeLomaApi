import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { FindPlugStation } from './plug-station.dto';
import { PlugStationService } from './plug-station.service';

@UseInterceptors(TransformInterceptor)
@Controller('plugStation')
export class PlugStationController {
  constructor(private readonly plugStationService: PlugStationService) {}

  @Get()
  getPlugStation(@Query() query:FindPlugStation){
    return this.plugStationService.getPlugStation(query)
  }
}
