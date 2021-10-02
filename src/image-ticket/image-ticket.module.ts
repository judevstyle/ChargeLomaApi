import { Module } from '@nestjs/common';
import { ImageTicketService } from './image-ticket.service';
import { ImageTicketController } from './image-ticket.controller';

@Module({
  controllers: [ImageTicketController],
  providers: [ImageTicketService]
})
export class ImageTicketModule {}
