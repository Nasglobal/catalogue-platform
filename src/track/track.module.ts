import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Track } from './track.entity';

import { TrackService } from './track.service';

import { TrackController } from './track.controller';

import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({

  imports: [
    TypeOrmModule.forFeature([
      Track,
    ]),

    ApiKeyModule,
  ],

  controllers: [
    TrackController,
  ],

  providers: [
    TrackService,
  ],

  exports: [
    TrackService,
  ],
})
export class TrackModule {}