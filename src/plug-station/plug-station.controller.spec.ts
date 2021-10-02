import { Test, TestingModule } from '@nestjs/testing';
import { PlugStationController } from './plug-station.controller';
import { PlugStationService } from './plug-station.service';

describe('PlugStationController', () => {
  let controller: PlugStationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlugStationController],
      providers: [PlugStationService],
    }).compile();

    controller = module.get<PlugStationController>(PlugStationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
