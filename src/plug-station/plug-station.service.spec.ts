import { Test, TestingModule } from '@nestjs/testing';
import { PlugStationService } from './plug-station.service';

describe('PlugStationService', () => {
  let service: PlugStationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlugStationService],
    }).compile();

    service = module.get<PlugStationService>(PlugStationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
