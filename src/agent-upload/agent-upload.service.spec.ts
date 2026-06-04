import { Test, TestingModule } from '@nestjs/testing';
import { AgentUploadService } from './agent-upload.service';

describe('AgentUploadService', () => {
  let service: AgentUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentUploadService],
    }).compile();

    service = module.get<AgentUploadService>(AgentUploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
