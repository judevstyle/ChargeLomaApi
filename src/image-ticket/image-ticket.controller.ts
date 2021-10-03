import { Body, Controller, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { PostImageTicket } from './image-ticket.dto';
import { ImageTicketService } from './image-ticket.service';

@Controller('imageTicket')
@UseInterceptors(TransformInterceptor)
export class ImageTicketController {
  constructor(private readonly imageTicketService: ImageTicketService) { }

  @Post()
  @UseGuards(AuthGuard(['user']))
  async postImageTicket(@Request() req, @Body() body: PostImageTicket) {
    return this.imageTicketService.postImageTicket(req.user.uid, body)
  }
}
