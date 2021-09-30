import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Put, Query } from '@nestjs/common';
import { StationService } from './station.service';
import { CreateStationDto, StationfromLocation, StationNearby } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';

@Controller('station')
@UseInterceptors(TransformInterceptor)
export class StationController {
  constructor(private readonly stationService: StationService) { }

  @Post()
  create(@Body() createStationDto: CreateStationDto) {
    return this.stationService.create(createStationDto);
  }

  @Get()
  findAll() {
    return this.stationService.findAll();
  }

  @Get('stationNearly')
  stationNearly(@Query() query: StationNearby) {
    return this.stationService.stationNearly(query);
  }

  @Get('stationfromLocation')
  stationfromLocation(@Query() query: StationfromLocation) {
    return this.stationService.stationfromLocation(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stationService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStationDto: UpdateStationDto) {
    return this.stationService.update(id, updateStationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stationService.remove(id);
  }
}

