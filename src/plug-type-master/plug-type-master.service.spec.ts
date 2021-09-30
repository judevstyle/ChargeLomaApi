import { Test, TestingModule } from '@nestjs/testing';
import { PlugTypeMasterService } from './plug-type-master.service';

describe('PlugTypeMasterService', () => {
  let service: PlugTypeMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlugTypeMasterService],
    }).compile();

    service = module.get<PlugTypeMasterService>(PlugTypeMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
