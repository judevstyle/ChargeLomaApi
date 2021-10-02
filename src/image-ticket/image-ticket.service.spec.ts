import { Test, TestingModule } from '@nestjs/testing';
import { ImageTicketService } from './image-ticket.service';

describe('ImageTicketService', () => {
  let service: ImageTicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageTicketService],
    }).compile();

    service = module.get<ImageTicketService>(ImageTicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
