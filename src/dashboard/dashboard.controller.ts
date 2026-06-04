import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';
import { DashboardOnly } from '../auth/decorators/dashboard.decorator';



@DashboardOnly()
@Controller('dashboard')

@UseGuards(JwtAuthGuard)

export class DashboardController {

  
  @Get()
  getDashboard() {

    return {
      success: true,
      message:
        'Protected dashboard route',
    };
  }
}