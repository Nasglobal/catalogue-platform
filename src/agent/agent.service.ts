import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Agent } from './agent.entity';

import { Track } from '../track/track.entity';

import { Album } from '../album/album.entity';

@Injectable()
export class AgentService {

  constructor(

    @InjectRepository(Agent)
    private readonly agentRepository: Repository<Agent>,

    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,

    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,

  ) {}
  

async insertAgents(agents: any[]) {

  if (!agents.length) return;

  await this.agentRepository
    .createQueryBuilder()
    .insert()
    .into(Agent)
    .values(agents)

    .orUpdate(
      [
        'labelNamePkt',
        'labelRoyaltyRate',
        'currencyPreferred',
        'labelStatus',
        'contractStartDate',
        'contractEndDate',
        'nameFirst',
        'nameLast',
        'email1',
        'email2',
        'email3',
        'labelPhone',
        'addressLine1',
        'addressCityState',
        'addressCountry',
        'addressZipCode',
      ],

      ['zkp_Label'],
    )

    .execute();
   }

  async getAgents({
  page,
  limit,
  search,
  status,
  orderBy,
  order,
}: any) {

  const qb =
    this.agentRepository
      .createQueryBuilder('agent');

  // SEARCH
  if (search) {

    qb.andWhere(
      `
      (
        LOWER(agent.labelNamePkt)
        LIKE LOWER(:search)

        OR LOWER(agent.zkp_Label)
        LIKE LOWER(:search)

        OR LOWER(agent.nameFirst)
        LIKE LOWER(:search)

        OR LOWER(agent.nameLast)
        LIKE LOWER(:search)

        OR LOWER(agent.email1)
        LIKE LOWER(:search)
      )
      `,
      {
        search: `%${search}%`,
      },
    );
  }

  // FILTER
  if (status) {

    qb.andWhere(
      `
      LOWER(agent.labelStatus)
      = LOWER(:status)
      `,
      {
        status,
      },
    );
  }

  // ORDERING
  qb.orderBy(
    `agent.${orderBy}`,
    order,
  );

  // PAGINATION
  qb.skip((page - 1) * limit)
    .take(limit);

  const [data, total] =
    await qb.getManyAndCount();

  return {

    data,

    pagination: {

      total,

      page,

      limit,

      totalPages:
        Math.ceil(
          total / limit,
        ),
    },
  };
}


async getAgentTracks({
      agentId,
      page,
      limit,
      search,
      genre,
      orderBy,
      order,
    }: any) {

      const agent =
        await this.agentRepository.findOne({
          where: { id: agentId },
        });

      if (!agent) {

        throw new Error(
          'Agent not found',
        );
      }

      const qb =
        this.trackRepository
          .createQueryBuilder('track')

          .where(
            'track.labelName = :labelName',
            {
              labelName:
                agent.labelNamePkt,
            },
          );

      // SEARCH
      if (search) {

        qb.andWhere(
          `
          (
            LOWER(track.title)
            LIKE LOWER(:search)

            OR LOWER(track.artist)
            LIKE LOWER(:search)

            OR LOWER(track.isrc)
            LIKE LOWER(:search)

            OR LOWER(track.displayUpc)
            LIKE LOWER(:search)
          )
          `,
          {
            search: `%${search}%`,
          },
        );
      }

      // FILTER
      if (genre) {

        qb.andWhere(
          'LOWER(track.genre) = LOWER(:genre)',
          {
            genre,
          },
        );
      }

      // ORDER
      qb.orderBy(
        `track.${orderBy}`,
        order,
      );

      // PAGINATION
      qb.skip((page - 1) * limit)
        .take(limit);

      const [data, total] =
        await qb.getManyAndCount();

      return {

        data,

        pagination: {

          total,

          page,

          limit,

          totalPages:
            Math.ceil(
              total / limit,
            ),
        },
      };
    }


    async getAgentAlbums({
      agentId,
      page,
      limit,
      search,
      orderBy,
      order,
    }: any) {

  const agent =
    await this.agentRepository.findOne({
      where: { id: agentId },
    });

  if (!agent) {

    throw new Error(
      'Agent not found',
    );
  }

  const qb =
    this.albumRepository
      .createQueryBuilder('album')

      .where(
        'album.labelName = :labelName',
        {
          labelName:
            agent.labelNamePkt,
        },
      );

  // SEARCH
  if (search) {

    qb.andWhere(
      `
      (
        LOWER(album.releaseName)
        LIKE LOWER(:search)

        OR LOWER(album.displayUpc)
        LIKE LOWER(:search)

        OR LOWER(album.labelName)
        LIKE LOWER(:search)
      )
      `,
      {
        search: `%${search}%`,
      },
    );
  }

  // ORDER
  qb.orderBy(
    `album.${orderBy}`,
    order,
  );

  // PAGINATION
  qb.skip((page - 1) * limit)
    .take(limit);

  const [data, total] =
    await qb.getManyAndCount();

  return {

    data,

    pagination: {

      total,

      page,

      limit,

      totalPages:
        Math.ceil(
          total / limit,
        ),
    },
  };
}


async getAgentStats(
  agentId: number,
) {

  const agent =
    await this.agentRepository.findOne({
      where: { id: agentId },
    });

  if (!agent) {

    throw new Error(
      'Agent not found',
    );
  }

  const labelName =
    agent.labelNamePkt;

  const [
    totalTracks,
    totalAlbums,
  ] = await Promise.all([

    this.trackRepository.count({
      where: {
        labelName: labelName,
      },
    }),

    this.albumRepository.count({
      where: {
        labelName: labelName,
      },
    }),
  ]);

  return {

    agent: {

      id: agent.id,

      zkp_Label:
        agent.zkp_Label,

      labelName:
        agent.labelNamePkt,
    },

    statistics: {

      totalTracks,

      totalAlbums,
    },
  };
}


}