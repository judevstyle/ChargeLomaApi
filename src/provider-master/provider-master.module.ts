import { Module } from '@nestjs/common';
import { ProviderMasterService } from './provider-master.service';
import { ProviderMasterController } from './provider-master.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProviderMasterController],
  providers: [ProviderMasterService]
})
export class ProviderMasterModule { }
