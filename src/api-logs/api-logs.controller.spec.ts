import { Test, TestingModule } from '@nestjs/testing';
import { ApiLogsController } from './api-logs.controller';

describe('ApiLogsController', () => {
  let controller: ApiLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiLogsController],
    }).compile();

    controller = module.get<ApiLogsController>(ApiLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
