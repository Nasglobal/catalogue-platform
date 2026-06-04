import {
  Injectable,
  UnauthorizedException,
  Request,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import * as crypto from 'crypto';

import { ApiKey } from './entities/api-key.entity';

import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class ApiKeyService {

  constructor(
    @InjectRepository(ApiKey)
    private readonly repo: Repository<ApiKey>,
    
    private readonly auditService: AuditService,
  ) {}

  // =========================
  // CREATE API KEY
  // =========================

  async create(
    appName: string,
    user:any,
    description?: string,
  ) {

    // RAW KEY (shown once to user)
    const rawKey = crypto
      .randomBytes(32)
      .toString('hex');

    // HASHED KEY (stored in DB)
    const keyHash = crypto
      .createHash('sha256')
      .update(rawKey)
      .digest('hex');

    const apiKey = this.repo.create({
      appName,
      description,
      keyHash,
      isActive: true,
    });

    await this.repo.save(apiKey);

  
    await this.auditService.log({
        userId: user.id,
        userEmail: user.email,

        action: 'CREATE_API_KEY',

        resource: 'API_KEY',

        resourceId: String(apiKey.id),

        metadata: {
          appName,
        },
      });

    // return ONLY ONCE
    return {
      apiKey: rawKey,
      appName,
      description,
    };
  }

  // =========================
  // VALIDATE KEY
  // =========================

  async validateKey(rawKey: string) {

    if (!rawKey) {
      throw new UnauthorizedException(
        'API key missing',
      );
    }
    
    // const keyHash = crypto
    //   .createHash('sha256')
    //   .update(rawKey)
    //   .digest('hex');

    //console.log("keyHash: ",keyHash)

    const apiKey = await this.repo.findOne({
      where: {
        keyHash:rawKey,
        isActive: true,
      },
    });

    if (!apiKey) {
      throw new UnauthorizedException(
        'Invalid API key',
      );
    }

    return apiKey;
  }

  // =========================
  // GET ALL KEYS
  // =========================

  async getAll() {

    return this.repo.find({
      order: {
        id: 'DESC',
      },
    });
  }

  // =========================
  // DEACTIVATE KEY
  // =========================

  async deactivate(id: number) {

    await this.repo.update(id, {
      isActive: false,
    });

    return {
      success: true,
    };
  }
}