import { Module } from '@nestjs/common';
import { PlugTypeMasterService } from './plug-type-master.service';
import { PlugTypeMasterController } from './plug-type-master.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [PlugTypeMasterController],
  providers: [PlugTypeMasterService]
})
export class PlugTypeMasterModule {}
