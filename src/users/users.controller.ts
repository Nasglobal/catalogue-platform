import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';

import { UsersService }
from './users.service';

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';

import { RolesGuard }
from '../auth/guards/roles.guard';

import { Roles }
from '../auth/decorators/roles.decorator';

import { DashboardOnly } from '../auth/decorators/dashboard.decorator';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';


@DashboardOnly()
@Controller('users')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class UsersController {

  constructor(
    private readonly usersService:
      UsersService,
  ) {}

  @Roles('SUPER_ADMIN')
  @Get()
  async getUsers() {

    return this.usersService.findAll();
  }

  @Roles('SUPER_ADMIN')
  @Patch(':id/deactivate')
  async deactivate(
    @Param('id') id: number,
  ) {

    return this.usersService.deactivate(
      Number(id),
    );
  }

  @Roles('SUPER_ADMIN')
  @Patch(':id/role')
  async updateRole(
    @Param('id') id: number,
    @Body()
    body: {
      role: string;
    },
     @CurrentUser() user,
  ) {

    return this.usersService.updateRole(
      Number(id),
      body.role,
      user
    );
  }
}