import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProviderMasterModule } from './provider-master/provider-master.module';
import { StationModule } from './station/station.module';
import { PlugTypeMasterModule } from './plug-type-master/plug-type-master.module';

@Module({
  imports: [PrismaModule, ProviderMasterModule, StationModule, PlugTypeMasterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
