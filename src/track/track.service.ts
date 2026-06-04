import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Track } from './track.entity';

import { QueryTrackDto } from './dto/query-track.dto';

@Injectable()
export class TrackService {

  constructor(

    @InjectRepository(Track)
    private readonly repo:
      Repository<Track>,
  ) {}

  // ================= INSERT =================

  async insertTracks(
    records: Partial<Track>[],
  ) {

    if (!records.length) return;

    await this.repo
      .createQueryBuilder()
      .insert()
      .into(Track)
      .values(records)
      .orIgnore()
      .execute();
  }

  // ================= GET TRACKS =================

  async getTracks(
    query: QueryTrackDto,
  ) {

    const page =
      Number(query.page || 1);

    const limit =
      Math.min(
        Number(query.limit || 50),
        500,
      );

    const skip =
      (page - 1) * limit;

    const qb =
      this.repo.createQueryBuilder(
        'track',
      );

    // SEARCH

    if (query.search) {

      qb.andWhere(

        `(LOWER(track.title)
          LIKE LOWER(:search)

        OR LOWER(track.artist)
          LIKE LOWER(:search)

        OR LOWER(track.isrc)
          LIKE LOWER(:search)

        OR LOWER(track.displayUpc)
          LIKE LOWER(:search)
        
        OR LOWER(track.labelName)
          LIKE LOWER(:search))`,

        {
          search:
            `%${query.search}%`,
        },
      );
    }


    // FILTERS

    if (query.artist) {

      qb.andWhere(

        `LOWER(track.artist)
          LIKE LOWER(:artist)`,

        {
          artist:
            `%${query.artist}%`,
        },
      );


    }if (query.title) {

      qb.andWhere(

        `LOWER(track.title)
          LIKE LOWER(:title)`,

        {
          title:
            `%${query.title}%`,
        },
      );
    }



     if (query.labelName) {

      qb.andWhere(

        `LOWER(track.labelName)
          LIKE LOWER(:labelName)`,

        {
          labelName:
            `%${query.labelName}%`,
        },
      );
    }

    if (query.isrc) {

      qb.andWhere(
        'track.isrc = :isrc',
        {
          isrc: query.isrc,
        },
      );
    }

    if (query.displayUpc) {

      qb.andWhere(
        'track.displayUpc = :upc',
        {
          upc:
            query.displayUpc,
        },
      );
    }

    // SORTING

    const allowedSorts = [

      'id',

      'title',

      'artist',

      'isrc',

      'createdAt',
    ];

    const sort =
      allowedSorts.includes(
        query.sort || '',
      )
        ? query.sort!
        : 'id';

    const order =
      query.order === 'ASC'
        ? 'ASC'
        : 'DESC';

    qb.orderBy(
      `track.${sort}`,
      order,
    );

    // PAGINATION

    qb.skip(skip).take(limit);

    // EXECUTE

    const [
      data,
      total,
    ] = await qb.getManyAndCount();

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

  // ================= SINGLE TRACK =================

  async getTrack(id: number) {

    return this.repo.findOne({

      where: { id },
    });
  }
}