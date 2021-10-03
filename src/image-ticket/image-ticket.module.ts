import { Module } from '@nestjs/common';
import { ImageTicketService } from './image-ticket.service';
import { ImageTicketController } from './image-ticket.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports:[PrismaModule],
  controllers: [ImageTicketController],
  providers: [ImageTicketService]
})
export class ImageTicketModule {}
