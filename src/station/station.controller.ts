import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Put, Query, UseGuards, Request } from '@nestjs/common';
import { StationService } from './station.service';
import { CreateStationDto, FindFilterQuery, FindImageStationQuery, FindOne, FindPostStationFilter, FindQuery, StationfromLocation, StationNearby } from './dto/create-station.dto';
import { UpdateStationDto } from './dto/update-station.dto';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { AuthGuard } from '@nestjs/passport';

@Controller('station')
@UseInterceptors(TransformInterceptor)
export class StationController {
  constructor(private readonly stationService: StationService) { }

  @Post()
  @UseGuards(AuthGuard(['user']))
  create(@Body() createStationDto: CreateStationDto,@Request() req) {
    const USER = req.user
    return this.stationService.create(USER.uid,createStationDto);
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

  @Post('stationFilter')
  PostStationFilter(@Body() body: FindPostStationFilter) {
    return this.stationService.PostStationFilter(body);
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
  @UseGuards(AuthGuard(['user']))
  update(@Param('id') id: string, @Body() updateStationDto: CreateStationDto,@Request() req) {
    const USER = req.user
    return this.stationService.update(USER.uid,id, updateStationDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(['user']))
  remove(@Param('id') id: string) {
    return this.stationService.remove(id);
  }
}

