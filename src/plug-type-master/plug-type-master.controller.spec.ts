import { Test, TestingModule } from '@nestjs/testing';
import { PlugTypeMasterController } from './plug-type-master.controller';
import { PlugTypeMasterService } from './plug-type-master.service';

describe('PlugTypeMasterController', () => {
  let controller: PlugTypeMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlugTypeMasterController],
      providers: [PlugTypeMasterService],
    }).compile();

    controller = module.get<PlugTypeMasterController>(PlugTypeMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
