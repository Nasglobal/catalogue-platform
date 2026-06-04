import {

  Controller,

  Get,

  Param,

  Query,

  UseGuards,

} from '@nestjs/common';

import { TrackService } from './track.service';

import { QueryTrackDto } from './dto/query-track.dto';

import { ApiKeyGuard } from '../auth/guards/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller('tracks')
export class TrackController {

  constructor(

    private readonly trackService:
      TrackService,
  ) {}

  // ALL TRACKS

  @Get()

  async getTracks(

    @Query()
    query: QueryTrackDto,
  ) {

    return this.trackService
      .getTracks(query);
  }

  // SINGLE TRACK

  @Get(':id')

  async getTrack(

    @Param('id')
    id: string,
  ) {

    return this.trackService
      .getTrack(Number(id));
  }
}