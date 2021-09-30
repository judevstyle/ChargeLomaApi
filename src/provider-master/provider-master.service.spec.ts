import { Test, TestingModule } from '@nestjs/testing';
import { ProviderMasterService } from './provider-master.service';

describe('ProviderMasterService', () => {
  let service: ProviderMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProviderMasterService],
    }).compile();

    service = module.get<ProviderMasterService>(ProviderMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
