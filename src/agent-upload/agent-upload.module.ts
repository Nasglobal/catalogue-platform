import { Module } from '@nestjs/common';

import { BullModule } from '@nestjs/bullmq';

import { MulterModule } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { AgentUploadController } from './agent-upload.controller';

import { AgentUploadService } from './agent-upload.service';

import { AgentUploadProcessor } from './agent-upload.processor';

import { AgentModule } from '../agent/agent.module';

import { AuditModule } from 'src/audit/audit.module';

@Module({
  imports: [

    AgentModule,
    AuditModule,

    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/agents',
        filename: (req, file, cb) => {

          cb(
            null,
            `${Date.now()}-${file.originalname}`,
          );
        },
      }),
    }),

    BullModule.registerQueue({
      name: 'agent-upload',

      connection: {
        host:
          process.env.REDIS_HOST ||
          '127.0.0.1',

        port: Number(
          process.env.REDIS_PORT || 6379,
        ),

        maxRetriesPerRequest: null,
      },
    }),
  ],

  controllers: [AgentUploadController],

  providers: [
    AgentUploadService,
    AgentUploadProcessor,
  ],
})
export class AgentUploadModule {}