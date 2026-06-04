import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { ApiKeyService } from '../../api-key/api-key.service';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class ApiKeyGuard
  implements CanActivate
{
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    // =========================
    // PUBLIC ROUTES
    // =========================

    const isPublic = this.reflector.getAllAndOverride(
      IS_PUBLIC_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (isPublic) {
      return true;
    }


    // =========================
    // Dashboard Routes
    // =========================

    const isDashboard =
          this.reflector.getAllAndOverride(
            'dashboard',
            [
              context.getHandler(),
              context.getClass(),
            ],
          );

        if (isDashboard) {
          return true;
        }

    // =========================
    // REQUEST
    // =========================

    const request =
      context.switchToHttp().getRequest<Request>();

    const apiKey =
  request.headers['x-api-key'];

console.log('HEADER API KEY:', apiKey);

const validatedKey =
  await this.apiKeyService.validateKey(
    String(apiKey),
  );

console.log('VALIDATED KEY:', validatedKey);

    // attach app info to request
    request['apiClient'] = validatedKey;

    return true;
  }
}