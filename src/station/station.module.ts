import { Module } from '@nestjs/common';
import { StationService } from './station.service';
import { StationController } from './station.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [StationController],
  providers: [StationService],
  imports: [PrismaModule]
})
export class StationModule { }
