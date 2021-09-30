import { Test, TestingModule } from '@nestjs/testing';
import { ProviderMasterController } from './provider-master.controller';
import { ProviderMasterService } from './provider-master.service';

describe('ProviderMasterController', () => {
  let controller: ProviderMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProviderMasterController],
      providers: [ProviderMasterService],
    }).compile();

    controller = module.get<ProviderMasterController>(ProviderMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
