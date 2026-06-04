import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ApiRequestLog } from './entities/api-request-log.entity';

@Injectable()
export class ApiLogsService {

  constructor(
    @InjectRepository(ApiRequestLog)
    private readonly repo: Repository<ApiRequestLog>,
  ) {}

  async logRequest(data: Partial<ApiRequestLog>) {

    const log = this.repo.create(data);

    return this.repo.save(log);
  }

  // =========================================
  // GLOBAL STATS
  // =========================================

  async getGlobalStats() {

    const totalRequests =
      await this.repo.count();

    const successfulRequests =
      await this.repo.count({
        where: {
          statusCode: 200,
        },
      });

    const failedRequests =
      await this.repo
        .createQueryBuilder('log')
        .where('log.statusCode >= :code', {
          code: 400,
        })
        .getCount();

    return {
      totalRequests,
      successfulRequests,
      failedRequests,
    };
  }

  // =========================================
  // APP STATS
  // =========================================

  async getAppStats(apiKeyId: number) {

    const totalRequests =
      await this.repo.count({
        where: {
          apiKeyId,
        },
      });

    const endpoints =
      await this.repo
        .createQueryBuilder('log')
        .select('log.endpoint', 'endpoint')
        .addSelect(
          'COUNT(*)',
          'count',
        )
        .where(
          'log.apiKeyId = :apiKeyId',
          { apiKeyId },
        )
        .groupBy('log.endpoint')
        .orderBy('count', 'DESC')
        .getRawMany();

    return {
      totalRequests,
      endpoints,
    };
  }

  // =========================================
  // RECENT REQUESTS
  // =========================================

  async getRecentLogs(
    page = 1,
    limit = 50,
  ) {

    const [data, total] =
      await this.repo.findAndCount({
        order: {
          createdAt: 'DESC',
        },
        skip: (page - 1) * limit,
        take: limit,
      });

    return {
      total,
      page,
      limit,
      data,
    };
  }
}