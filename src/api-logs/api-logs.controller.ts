import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { ApiLogsService } from './api-logs.service';

@Controller('api-logs')
export class ApiLogsController {

  constructor(
    private readonly apiLogsService: ApiLogsService,
  ) {}

  @Get('stats')
  async getGlobalStats() {

    return this.apiLogsService
      .getGlobalStats();
  }

  @Get('recent')
  async getRecentLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {

    return this.apiLogsService.getRecentLogs(
      Number(page),
      Number(limit),
    );
  }

  @Get('app/:apiKeyId')
  async getAppStats(
    @Param('apiKeyId')
    apiKeyId: number,
  ) {

    return this.apiLogsService.getAppStats(
      Number(apiKeyId),
    );
  }
}