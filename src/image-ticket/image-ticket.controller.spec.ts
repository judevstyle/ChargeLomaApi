import { Test, TestingModule } from '@nestjs/testing';
import { ImageTicketController } from './image-ticket.controller';
import { ImageTicketService } from './image-ticket.service';

describe('ImageTicketController', () => {
  let controller: ImageTicketController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageTicketController],
      providers: [ImageTicketService],
    }).compile();

    controller = module.get<ImageTicketController>(ImageTicketController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
