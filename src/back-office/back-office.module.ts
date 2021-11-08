import { Module } from '@nestjs/common';
import { BackOfficeService } from './back-office.service';
import { BackOfficeController } from './back-office.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthBackoffice } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { StationService } from './station/station.service';
import { ProviderMasterService } from './provider-master/provider-master.service';
import { PlugTypeMasterService } from './plug-type-master/plug-type-master.service';
import { StationRequestService } from './station-request/station-request.service';
import { NewsService } from './news/news.service';
import { MemberService } from './member/member.service';
import { ImageTicketService } from './image-ticket/image-ticket.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '365d' }
    }),
    PrismaModule],
  controllers: [BackOfficeController],
  providers: [BackOfficeService, AuthBackoffice, StationService, ProviderMasterService, PlugTypeMasterService, StationRequestService, NewsService, MemberService, ImageTicketService]
})
export class BackOfficeModule { }
