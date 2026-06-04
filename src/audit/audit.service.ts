import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {

  constructor(
    @InjectRepository(AuditLog)
    private readonly repo:
      Repository<AuditLog>,
  ) {}

  async log(
    data: Partial<AuditLog>,
  ) {

    const audit =
      this.repo.create(data);

    return this.repo.save(audit);
  }



  async getLogs(
     page = 1,
        ) {

        const limit = 50;

        const [logs, total] =
            await this.repo.findAndCount({
            skip:
                (page - 1) * limit,

            take: limit,

            order: {
                id: 'DESC',
            },
            });

        return {
            data: logs,
            total,
            page,
        };
        }
}