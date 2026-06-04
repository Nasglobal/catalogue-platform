import { Test, TestingModule } from '@nestjs/testing';
import { AgentUploadController } from './agent-upload.controller';

describe('AgentUploadController', () => {
  let controller: AgentUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentUploadController],
    }).compile();

    controller = module.get<AgentUploadController>(AgentUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
