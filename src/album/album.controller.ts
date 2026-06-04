import {
  Controller,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AlbumService } from './album.service';

import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';


@UseGuards(ApiKeyGuard)
@Controller('albums')
export class AlbumController {

  constructor(
    private readonly albumService: AlbumService,
  ) {}

  @Get()
  async getAlbums(

    @Query('page') page = '1',

    @Query('limit') limit = '50',

    @Query('search') search?: string,

    @Query('vendorName') vendorName?: string,

    @Query('artist') artist?: string,

    @Query('title') title?: string,

    @Query('isrc') isrc?: string,

    @Query('labelName') labelName?: string,

    @Query('sortBy') sortBy = 'id',

    @Query('order') order: 'ASC' | 'DESC' = 'DESC',

  ) {

    return this.albumService.getAlbums({

      page: Number(page),

      limit: Number(limit),

      search,

      vendorName,

      labelName,

      artist,

      title,

      isrc,

      sortBy,

      order,
    });
  }
}