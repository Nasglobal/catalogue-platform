import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiLogsService } from './api-logs.service';

import { ApiLogsController } from './api-logs.controller';

import { ApiRequestLog } from './entities/api-request-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApiRequestLog,
    ]),
  ],

  providers: [
    ApiLogsService,
  ],

  controllers: [
    ApiLogsController,
  ],

  exports: [
    ApiLogsService,
  ],
})
export class ApiLogsModule {}