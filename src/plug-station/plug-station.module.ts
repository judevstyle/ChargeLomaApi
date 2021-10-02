import { Module } from '@nestjs/common';
import { PlugStationService } from './plug-station.service';
import { PlugStationController } from './plug-station.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PlugStationController],
  providers: [PlugStationService]
})
export class PlugStationModule { }
