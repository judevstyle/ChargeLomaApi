import { Test, TestingModule } from '@nestjs/testing';
import { StationRequestService } from './station-request.service';

describe('StationRequestService', () => {
  let service: StationRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StationRequestService],
    }).compile();

    service = module.get<StationRequestService>(StationRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
