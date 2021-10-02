import { Controller } from '@nestjs/common';
import { ImageTicketService } from './image-ticket.service';

@Controller('image-ticket')
export class ImageTicketController {
  constructor(private readonly imageTicketService: ImageTicketService) {}
}
