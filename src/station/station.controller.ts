import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Put, Query } from '@nestjs/common';
import { StationService } from './station.service';
import { CreateStationDto, FindFilterQuery, FindImageStationQuery, FindOne, FindQuery, StationfromLocation, StationNearby } from './dto/create-station.dto';
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
  findAll(@Query() query:FindQuery) {
    return this.stationService.findAll(query);
  }

  @Get('stationNearly')
  stationNearly(@Query() query: StationNearby) {
    return this.stationService.stationNearly(query);
  }

  @Get("stationReject")
  stationReject(@Query() query:FindQuery) {
    return this.stationService.stationReject(query);
  }

  @Get("stationApprove")
  stationApprove(@Query() query:FindQuery) {
    return this.stationService.stationApprove(query);
  }

  @Get("imageStation")
  imageStation(@Query() query:FindImageStationQuery) {
    return this.stationService.getImageStation(query);
  }


  @Get("stationWaitApprove")
  stationWaitApprove(@Query() query:FindQuery) {
    return this.stationService.stationWaitApprove(query);
  }

  @Get('stationFilter')
  stationFilter(@Query() query: FindFilterQuery) {
    return this.stationService.stationFilter(query);
  }

  @Get('stationfromLocation')
  stationfromLocation(@Query() query: StationfromLocation) {
    return this.stationService.stationfromLocation(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string,@Query() query:FindOne) {
    return this.stationService.findOne(id,query);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStationDto: CreateStationDto) {
    return this.stationService.update(id, updateStationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stationService.remove(id);
  }
}

