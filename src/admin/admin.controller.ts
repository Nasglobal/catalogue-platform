import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';

import { RolesGuard }
from '../auth/guards/roles.guard';

import { Roles }
from '../auth/decorators/roles.decorator';

import { DashboardOnly } from '../auth/decorators/dashboard.decorator';


@DashboardOnly()
@Controller('admin')

@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)

export class AdminController {

  @Roles('SUPER_ADMIN')
   
 
  @Get('stats')
  getAdminStats() {

    return {
      success: true,
      message:
        'SUPER ADMIN ACCESS',
    };
  }
}