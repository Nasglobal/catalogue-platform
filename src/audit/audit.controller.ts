import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';

import { RolesGuard }
from '../auth/guards/roles.guard';

import { Roles }
from '../auth/decorators/roles.decorator';

import { AuditService }
from './audit.service';
import { DashboardOnly } from 'src/auth/decorators/dashboard.decorator';


@DashboardOnly()
@Controller('audit')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class AuditController {

  constructor(
    private readonly auditService:
      AuditService,
  ) {}

  @Roles('SUPER_ADMIN')
  @Get()
  async getLogs(
    @Query('page')
    page = 1,
  ) {

    return this.auditService
      .getLogs(
        Number(page),
      );
  }
}