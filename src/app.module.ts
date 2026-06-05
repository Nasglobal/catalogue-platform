import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { AgentModule } from './agent/agent.module';
import { AgentUploadModule } from './agent-upload/agent-upload.module';
import { ApiKeyModule } from './api-key/api-key.module';

import { APP_INTERCEPTOR } from '@nestjs/core';

import { ApiLoggingInterceptor }
from './api-logs/interceptors/api-logging.interceptor';


import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './auth/guards/api-key.guard';


import {
  ThrottlerModule,
} from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { HealthController } from './health/health.controller';
import { AuditModule } from './audit/audit.module';
import { AdminModule } from './admin/admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { UsersModule } from './users/users.module';

import { ApiLogsModule } from './api-logs/api-logs.module';

import {
  ThrottlerGuard,
} from '@nestjs/throttler';


console.log('DATABASE_HOST:', process.env.DATABASE_HOST); 
console.log('DATABASE_PORT:', process.env.DATABASE_PORT);

console.log('REDIS_HOST:', process.env.REDIS_HOST);
console.log('REDIS_PORT:', process.env.REDIS_PORT);


@Module({
  imports: [

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',   
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || '127.0.0.1',
      port: Number(process.env.DATABASE_PORT || 5432),
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgres',
      database: process.env.DATABASE_NAME || 'catalogue_db',
      autoLoadEntities: true,
      synchronize: true,
      retryAttempts: 20,
      retryDelay: 3000,
    }),

    //  GLOBAL REDIS CONNECTION
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT || 6379),
        maxRetriesPerRequest: null,
      },
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),

    // request limit
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),

    //Feature modules
    UploadModule,
    TrackModule,
    AlbumModule,
    AgentModule,
    AgentUploadModule,
    ApiKeyModule,
    ApiLogsModule,
    UsersModule,
    AuthModule,
    DashboardModule,
    AdminModule,
    AuditModule,
    HealthModule,
  ],

  controllers: [AppController, AuthController, DashboardController, HealthController],

  providers: [
    AppService,
    {
    provide: APP_GUARD,
    useClass: ApiKeyGuard,
   },
   
    {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },

  {
  provide: APP_INTERCEPTOR,
  useClass: ApiLoggingInterceptor,
  },

  
  ],
})
export class AppModule {}