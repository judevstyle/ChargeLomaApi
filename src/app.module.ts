import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProviderMasterModule } from './provider-master/provider-master.module';

@Module({
  imports: [PrismaModule, ProviderMasterModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
