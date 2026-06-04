import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Agent } from './agent.entity';

import { AgentService } from './agent.service';

import { AgentController } from './agent.controller';

import { Track } from 'src/track/track.entity';

import { Album } from 'src/album/album.entity';

import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agent,Track,Album,]),

    ApiKeyModule,
  ],

  providers: [AgentService],

  controllers: [AgentController],

  exports: [AgentService],
})
export class AgentModule {}