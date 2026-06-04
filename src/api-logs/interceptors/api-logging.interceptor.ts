import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';

import { tap } from 'rxjs/operators';

import { Request, Response } from 'express';

import { ApiLogsService } from '../api-logs.service';

@Injectable()
export class ApiLoggingInterceptor
  implements NestInterceptor
{
  constructor(
    private readonly apiLogsService: ApiLogsService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {

    const request =
      context.switchToHttp().getRequest<Request>();

    const response =
      context.switchToHttp().getResponse<Response>();

    const start = Date.now();

    return next.handle().pipe(
      tap(async () => {

        const responseTime =
          Date.now() - start;

        const apiClient =
          request['apiClient'];

        // Skip public routes
        if (!apiClient) {
          return;
        }

        await this.apiLogsService.logRequest({
          apiKeyId: apiClient.id,

          appName: apiClient.appName,

          method: request.method,

          endpoint: request.originalUrl,

          statusCode: response.statusCode,

          ipAddress: request.ip,

          responseTime,
        });
      }),
    );
  }
}