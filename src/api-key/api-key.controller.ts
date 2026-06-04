import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { ApiKeyService } from './api-key.service';
import { Public } from 'src/auth/decorators/public.decorator';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Public()
@Controller('api-keys')
export class ApiKeyController {

  constructor(
    private readonly apiKeyService: ApiKeyService,
  ) {}

  @Post()
  async create(
    @Body() body: {
      appName: string;
      description?: string;
    },
     @CurrentUser() user,
  ) {

    return this.apiKeyService.create(
      body.appName,
      user,
      body.description,
    );
  }

  @Get()
  async getAll() {

    return this.apiKeyService.getAll();
  }

  @Post(':id/deactivate')
  async deactivate(
    @Param('id', ParseIntPipe) id: number,
  ) {

    return this.apiKeyService.deactivate(id);
  }
}