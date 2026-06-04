import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Album } from './album.entity';

@Injectable()
export class AlbumService {

  constructor(

    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,

  ) {}

  // ================= INSERT =================

  async insertAlbums(albums: any[]) {

    if (!albums.length) return;

    await this.albumRepository
      .createQueryBuilder()
      .insert()
      .into(Album)
      .values(albums)
      .orIgnore()
      .execute();
  }

  // ================= GET ALBUMS =================

  async getAlbums(params: {

    page: number;

    limit: number;

    search?: string;

    vendorName?: string;

    labelName?: string;

    artist?: string;

    isrc?: string;

    title?: string;

    sortBy?: string;

    order?: 'ASC' | 'DESC';
  }) {

    const {

      page,

      limit,

      search,

      vendorName,

      artist,

      isrc,

      title,

      labelName,

      sortBy = 'id',

      order = 'DESC',

    } = params;

    const query =
      this.albumRepository.createQueryBuilder('album');

    // ================= SEARCH =================

    if (search) {

      query.andWhere(
        `(
          LOWER(album.releaseName)
            LIKE LOWER(:search)

          OR LOWER(album.displayUpc)
            LIKE LOWER(:search)

          OR LOWER(album.labelName)
            LIKE LOWER(:search)

          OR LOWER(album.vendorName)
            LIKE LOWER(:search)
        )`,
        {
          search: `%${search}%`,
        },
      );
    }

    // ================= FILTERS =================

    if (vendorName) {

      query.andWhere(
        'LOWER(album.vendorName) = LOWER(:vendorName)',
        {
          vendorName,
        },
      );
    }

    if (labelName) {

      query.andWhere(
        'LOWER(album.labelName) = LOWER(:labelName)',
        {
          labelName,
        },
      );
    }


    if (artist) {

      query.andWhere(
        'LOWER(album.artist) = LOWER(:artist)',
        {
          artist,
        },
      );
    }


     if (isrc) {

      query.andWhere(
        'LOWER(album.isrc) = LOWER(:isrc)',
        {
          isrc,
        },
      );
    }


     if (title) {

      query.andWhere(
        'LOWER(album.title) = LOWER(:title)',
        {
          title,
        },
      );
    }

    // ================= ORDERING =================

    const allowedSortFields = [

      'id',

      'releaseName',

      'releaseDate',

      'vendorName',

      'labelName',

      'totalTracks',
    ];

    const finalSortField =
      allowedSortFields.includes(sortBy)
        ? sortBy
        : 'id';

    query.orderBy(
      `album.${finalSortField}`,
      order,
    );

    // ================= PAGINATION =================

    query.skip((page - 1) * limit);

    query.take(limit);

    const [data, total] =
      await query.getManyAndCount();

    return {

      data,

      total,

      page,

      limit,

      totalPages: Math.ceil(total / limit),
    };
  }
}