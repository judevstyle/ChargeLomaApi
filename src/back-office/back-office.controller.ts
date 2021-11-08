import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthBackoffice } from './auth/auth.service';
import { BackOfficeService } from './back-office.service';
import { CreateBackOfficeDto } from './dto/create-back-office.dto';
import { LoginBackOfficeDTO } from './dto/login-back-office.dto';
import { CreateUpdateNews } from './dto/news.dto';
import { CreateUpdatePlugTypeMasterDto } from './dto/plug-type-master.dto';
import { CreateUpdateProviderMasterDto } from './dto/provider-master.dto';
import { RegisterBackOfficeDTO } from './dto/register-back-office.dto';
import { CreateUpdateStationDto, FindAll } from './dto/station.dto';
import { UpdateBackOfficeDto } from './dto/update-back-office.dto';
import { ImageTicketService } from './image-ticket/image-ticket.service';
import { MemberService } from './member/member.service';
import { NewsService } from './news/news.service';
import { PlugTypeMasterService } from './plug-type-master/plug-type-master.service';
import { ProviderMasterService } from './provider-master/provider-master.service';
import { StationService } from './station/station.service';

@Controller('back-office')
export class BackOfficeController {
  constructor(
    private readonly backOfficeService: BackOfficeService,
    private readonly authService: AuthBackoffice,
    private readonly stationService: StationService,
    private readonly providerMasterService: ProviderMasterService,
    private readonly plugTypeMasterService: PlugTypeMasterService,
    private readonly newsService: NewsService,
    private readonly memberService: MemberService,
    private readonly imageTicketService: ImageTicketService,
  ) { }

  // Auth
  @Post('auth/register')
  register(@Body() bodyRegisterBackOffice: RegisterBackOfficeDTO) {
    return this.authService.register(bodyRegisterBackOffice);
  }

  @Post('auth/login')
  login(@Body() bodyLoginBackOffice: LoginBackOfficeDTO) {
    return this.authService.login(bodyLoginBackOffice);
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Get('auth/checkAuth')
  checkAuth(@Request() req) {
    const USER = req.user
    return this.authService.checkAuth(USER.username);
  }
  // End Auth

  // Station
  @UseGuards(AuthGuard(['superadmin']))
  @Get('station')
  getStation(@Request() req, @Query() query: FindAll) {
    const USER = req.user
    return this.stationService.findAll(query);
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Get('station-dummy')
  getStationDummy(@Request() req, @Query() query: FindAll) {
    const USER = req.user
    return this.stationService.findAllDummy(query);
  }


  @UseGuards(AuthGuard(['superadmin']))
  @Get('station/plugTypeMaster')
  getPlugTypeMaster(@Request() req) {
    const USER = req.user
    return this.stationService.findAllPlugTypeMaster();
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Get('station/providerMaster')
  getProviderMaster(@Request() req) {
    const USER = req.user
    return this.stationService.findAllProviderMaster();
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Post('station')
  createStation(@Request() req, @Body() body: CreateUpdateStationDto) {
    const USER = req.user
    return this.stationService.createStation(body);
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Get('station/:id')
  findOneStation(@Param('id') id: string) {
    return this.stationService.findOne(id);
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Get('station-dummy/:id')
  findOneStationDummy(@Param('id') id: string) {
    return this.stationService.findOneDummy(id);
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Put('station-dummy/approve/:id')
  approveStationDummy(@Param('id') id: string) {
    return this.stationService.approveStationDummy(id);
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Put('station-dummy/reject/:id')
  rejectStationDummy(@Param('id') id: string) {
    return this.stationService.rejectStationDummy(id);
  }

  @Put('station/:id')
  @UseGuards(AuthGuard(['user']))
  updateStation(@Param('id') id: string, @Body() updateStationDto: CreateUpdateStationDto, @Request() req) {
    const USER = req.user
    return this.stationService.update(id, updateStationDto);
  }

  @Delete('station/:id')
  @UseGuards(AuthGuard(['user']))
  deleteStation(@Param('id') id: string, @Request() req) {
    const USER = req.user
    return this.stationService.remove(id);
  }

  // End Staion


  // Ticket Image Request

  @UseGuards(AuthGuard(['superadmin']))
  @Get('ticket-image-request')
  getTicketImageRequest(@Request() req, @Query() query: FindAll) {
    const USER = req.user
    return this.imageTicketService.findAllTicketImageRequest();
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Get('ticket-image-request/:id')
  getOneTicketImageRequest(@Param('id') id: string) {
    // const USER = req.user
    return this.imageTicketService.findOne(+id);
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Put('ticket-image-request/approve/:id')
  approveTicketImageRequestDummy(@Param('id') id: string) {
    return this.imageTicketService.approveTicketImage(+id);
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Put('ticket-image-request/reject/:id')
  rejectTicketImageRequestDummy(@Param('id') id: string) {
    return this.imageTicketService.rejectTicketImage(+id);
  }

  // Provider Master

  @UseGuards(AuthGuard(['superadmin']))
  @Get('provider-master')
  getProviderMasterAll(@Request() req) {
    const USER = req.user
    return this.providerMasterService.findAll();
  }


  @UseGuards(AuthGuard(['superadmin']))
  @Post('provider-master')
  createProviderMaster(@Request() req, @Body() body: CreateUpdateProviderMasterDto) {
    const USER = req.user
    return this.providerMasterService.create(body);
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Get('provider-master/:id')
  findOneProviderMaster(@Param('id') id: number) {
    return this.providerMasterService.findOne(+id);
  }

  @Put('provider-master/:id')
  @UseGuards(AuthGuard(['user']))
  updateProviderMaster(@Param('id') id: number, @Body() updateStationDto: CreateUpdateProviderMasterDto, @Request() req) {
    const USER = req.user
    return this.providerMasterService.update(+id, updateStationDto);
  }

  @Delete('provider-master/:id')
  @UseGuards(AuthGuard(['user']))
  deleteProviderMaster(@Param('id') id: number, @Request() req) {
    const USER = req.user
    return this.providerMasterService.remove(+id);
  }

  // End Provider Master




  // Plug Type Master

  @UseGuards(AuthGuard(['superadmin']))
  @Get('plug-type-master')
  getPlugTypeMasterAll(@Request() req) {
    const USER = req.user
    return this.plugTypeMasterService.findAll();
  }


  @UseGuards(AuthGuard(['superadmin']))
  @Post('plug-type-master')
  createPlugTypeMaster(@Request() req, @Body() body: CreateUpdatePlugTypeMasterDto) {
    const USER = req.user
    return this.plugTypeMasterService.create(body);
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Get('plug-type-master/:id')
  findOnePlugTypeMaster(@Param('id') id: number) {
    return this.plugTypeMasterService.findOne(+id);
  }

  @Put('plug-type-master/:id')
  @UseGuards(AuthGuard(['user']))
  updatePlugTypeMaster(@Param('id') id: number, @Body() updateStationDto: CreateUpdatePlugTypeMasterDto, @Request() req) {
    const USER = req.user
    return this.plugTypeMasterService.update(+id, updateStationDto);
  }

  @Delete('plug-type-master/:id')
  @UseGuards(AuthGuard(['user']))
  deletePlugTypeMaster(@Param('id') id: number, @Request() req) {
    const USER = req.user
    return this.plugTypeMasterService.remove(+id);
  }

  // End Plug Type Master


  // News

  @UseGuards(AuthGuard(['superadmin']))
  @Get('news')
  getNewsAll(@Request() req) {
    const USER = req.user
    return this.newsService.findAll();
  }


  @UseGuards(AuthGuard(['superadmin']))
  @Post('news')
  createNews(@Request() req, @Body() body: CreateUpdateNews) {
    const USER = req.user
    return this.newsService.create(body);
  }

  @UseGuards(AuthGuard(['superadmin']))
  @Get('news/:id')
  findOneNews(@Param('id') id: number) {
    return this.newsService.findOne(+id);
  }

  @Put('news/:id')
  @UseGuards(AuthGuard(['user']))
  updateNews(@Param('id') id: number, @Body() updateStationDto: CreateUpdateNews, @Request() req) {
    const USER = req.user
    return this.newsService.update(+id, updateStationDto);
  }

  @Delete('news/:id')
  @UseGuards(AuthGuard(['user']))
  deleteNews(@Param('id') id: number, @Request() req) {
    const USER = req.user
    return this.newsService.remove(+id);
  }

  // End News


  @UseGuards(AuthGuard(['superadmin']))
  @Get('member')
  getMember(@Request() req) {
    const USER = req.user
    return this.memberService.findAllMember();
  }



  @Post()
  create(@Body() createBackOfficeDto: CreateBackOfficeDto) {
    return this.backOfficeService.create(createBackOfficeDto);
  }

  @Get()
  findAll() {
    return this.backOfficeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.backOfficeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBackOfficeDto: UpdateBackOfficeDto) {
    return this.backOfficeService.update(+id, updateBackOfficeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backOfficeService.remove(+id);
  }
}
