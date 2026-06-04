import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';

import { AgentService } from './agent.service';
import { ApiKeyGuard } from 'src/auth/guards/api-key.guard';


@UseGuards(ApiKeyGuard)
@Controller('agents')
export class AgentController {

  constructor(
    private readonly agentService: AgentService,
  ) {}

  @Get()
    getAgents(

    @Query('page') page = 1,

    @Query('limit') limit = 50,

    @Query('search') search?: string,

    @Query('status') status?: string,

    @Query('orderBy')
    orderBy = 'id',

    @Query('order')
    order:
      | 'ASC'
      | 'DESC' = 'DESC',
  ) {

    return this.agentService.getAgents({

      page: Number(page),

      limit: Number(limit),

      search,

      status,

      orderBy,

      order,
    });
  }


  @Get(':id/tracks')
  getAgentTracks(
    @Param('id') id: number,

    @Query('page') page = 1,

    @Query('limit') limit = 50,

    @Query('search') search?: string,

    @Query('genre') genre?: string,

    @Query('orderBy') orderBy = 'id',

    @Query('order') order:
      | 'ASC'
      | 'DESC' = 'DESC',
  ) {

    return this.agentService.getAgentTracks({
      agentId: Number(id),
      page: Number(page),
      limit: Number(limit),
      search,
      genre,
      orderBy,
      order,
    });
  }

@Get(':id/albums')
    getAgentAlbums(
    @Param('id') id: number,

    @Query('page') page = 1,

    @Query('limit') limit = 50,

    @Query('search') search?: string,

    @Query('orderBy') orderBy = 'id',

    @Query('order') order:
      | 'ASC'
      | 'DESC' = 'DESC',
  ) {

    return this.agentService.getAgentAlbums({
      agentId: Number(id),
      page: Number(page),
      limit: Number(limit),
      search,
      orderBy,
      order,
    });
  }

@Get(':id/stats')
  getAgentStats(
    @Param('id') id: number,
  ) {

    return this.agentService.getAgentStats(
      Number(id),
    );
  }
}