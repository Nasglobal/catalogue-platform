import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';

import { Public } from './decorators/public.decorator';

import { JwtAuthGuard }
from '../auth/guards/jwt-auth.guard';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  async register(
    @Body() body: any,
  ) {

    return this.authService.register(
      body,
    );
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: any,
  ) {

    return this.authService.login(
      body.email,
      body.password,
    );
  }

@Public()
@Post('refresh')
async refresh(
  @Body()
  body: {
    refreshToken: string;
  },
) {

  return this.authService.refresh(
    body.refreshToken,
  );
}

@UseGuards(JwtAuthGuard)
@Post('logout')
async logout(
  @Request() req,
) {

  return this.authService.logout(
    req.user.id,
    req.user.email,
  );
}

}