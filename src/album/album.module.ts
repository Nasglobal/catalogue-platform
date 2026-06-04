import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Album } from './album.entity';

import { AlbumService } from './album.service';

import { AlbumController } from './album.controller';

import { ApiKeyModule } from 'src/api-key/api-key.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album]),

    ApiKeyModule,
  ],

  providers: [AlbumService],

  controllers: [AlbumController],

  exports: [AlbumService],
})
export class AlbumModule {}