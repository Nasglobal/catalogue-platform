import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

import * as ExcelJS from 'exceljs';
import * as crypto from 'crypto';
import * as path from 'path';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';

import { Upload } from './upload.entity';

import { createColumnMap } from '../utils/column-mapper';

import {
  CATALOGUE_COLUMNS,
} from '../utils/expected-columns';

import {
  validateColumns,
} from '../utils/validate-columns';

@Processor('catalogue')
export class UploadProcessor extends WorkerHost {

  constructor(

    private readonly trackService: TrackService,

    private readonly albumService: AlbumService,

    @InjectRepository(Upload)
    private readonly uploadRepo: Repository<Upload>,
  ) {
    super();
  }

  async process(job: Job) {

    console.log('🔥 PROCESSOR STARTED');

    const {
      filePath,
      uploadId,
    } = job.data;

    const absolutePath =
      path.resolve(filePath);

    console.log(
      'Processing:',
      absolutePath,
    );

    try {

      const workbook =
        new ExcelJS.stream.xlsx.WorkbookReader(
          absolutePath,
          {
            entries: 'emit',
            sharedStrings: 'cache',
            hyperlinks: 'ignore',
            worksheets: 'emit',
          },
        );

      let count = 0;

      let insertedTracks = 0;

      let insertedAlbums = 0;

      let columnMap:
        Record<string, number> = {};

      let isHeaderProcessed = false;

      const trackBatch: any[] = [];

      const albumBatch: any[] = [];

      const TRACK_BATCH_SIZE = 5000;

      const ALBUM_BATCH_SIZE = 2000;

      for await (
        const worksheet of workbook
      ) {

        console.log(
          'Worksheet detected',
        );

        for await (
          const row of worksheet
        ) {

          count++;

          const v =
            row.values as any[];

          // HEADER

         if (!isHeaderProcessed) {

            const uploadedHeaders: string[] = [];

            v.forEach(
              (cell: any, index: number) => {

                if (!cell) return;

                let header = '';

                // HANDLE EXCELJS OBJECT CELLS
                if (typeof cell === 'object') {

                  header = String(
                    cell.text ||
                    cell.value ||
                    '',
                  ).trim();

                } else {

                  header = String(cell).trim();
                }

                if (!header) return;

                uploadedHeaders.push(header);

                columnMap[header] = index;
              },
            );

            console.log(
              'CATALOGUE HEADERS:',
              uploadedHeaders,
            );

            // VALIDATE COLUMNS
            const validation =
              validateColumns(
                uploadedHeaders,
                CATALOGUE_COLUMNS,
              );

            // INVALID FILE
            if (!validation.valid) {

              const errorMessage = JSON.stringify({

                message:
                  'Invalid catalogue file',

                missingColumns:
                  validation.missingColumns,

                unexpectedColumns:
                  validation.unexpectedColumns,

                expectedColumns:
                  CATALOGUE_COLUMNS,
              });

              console.error(errorMessage);

              // UPDATE UPLOAD STATUS
              await this.uploadRepo.update(
                uploadId,
                {
                  status: 'FAILED',

                  error: errorMessage,

                  createdAt: new Date(),
                },
              );

              throw new Error(errorMessage);
            }

            console.log(
              'VALID CATALOGUE FILE',
            );

            isHeaderProcessed = true;

            continue;
          }

          const get = (
            name: string,
          ) => v[columnMap[name]];

          const dataType = String(
            get('DataType') || '',
          )
            .toLowerCase()
            .trim();

          const isDeleted =
            String(
              get('Deleted?') || '',
            ).trim() === 'Y';

          // HASH

          const rowHash = crypto
            .createHash('md5')
            .update(JSON.stringify(v))
            .digest('hex');

          // TRACK

          if (dataType === 'track') {

            trackBatch.push({

              isrc:
                get('ISRC'),

              title:
                get('Title'),

              artist:
                get('Artist'),

              labelName:get('LabelName'),

              releaseName:
                get('ReleaseName'),

              releaseDate:
                get('ReleaseDate'),

              recordingArtist:
                get(
                  'RecordingArtist',
                ),

              genre:
                get('Genre'),

              bpm:
                Number(
                  get('BPM'),
                ) || null,

              trackDuration:
                get(
                  'TrackDuration',
                ),

              trackNo:
                Number(
                  get('TrackNo'),
                ) || null,

              volumeNo:
                Number(
                  get('VolumeNo'),
                ) || null,

              language:
                get('Language'),

              producer:
                get('Producer'),

              publisher:
                get('Publisher'),

              writer:
                get('Writer'),

              pLine:
                get('P_Line'),

              cLine:
                get('C_Line'),

              displayUpc:
                get('DisplayUPC'),

              isDeleted,

              rowHash,
            });
          }

          // ALBUM

          if (dataType === 'album') {

            albumBatch.push({

              displayUpc:
                get('DisplayUPC'),

               isrc:
                get('ISRC'),

              title:
                get('Title'),

              artist:
                get('Artist'),

              recordingArtist:
                get(
                  'RecordingArtist',
                ),

              releaseName:
                get('ReleaseName'),

              releaseDate:
                get('ReleaseDate'),

              labelName:get('LabelName'),
              vendorName:get('VendorName'),
              totalTracks:Number(get('TotalTracks',),) || null,
              totalVolumes:
                Number(
                  get(
                    'TotalVolumes',
                  ),
                ) || null,

              priceBand:
                get('PriceBand'),

              wholesalePrice:
                Number(
                  get(
                    'WholesalePrice',
                  ),
                ) || null,

              territories:
                get('Territories'),

              isDeleted,

              rowHash,
            });
          }

          // TRACK SAVE

          if (
            trackBatch.length >=
            TRACK_BATCH_SIZE
          ) {

            await this.trackService
              .insertTracks(
                trackBatch,
              );

            insertedTracks +=
              trackBatch.length;

            trackBatch.length = 0;
          }

          // ALBUM SAVE

          if (
            albumBatch.length >=
            ALBUM_BATCH_SIZE
          ) {

            await this.albumService
              .insertAlbums(
                albumBatch,
              );

            insertedAlbums +=
              albumBatch.length;

            albumBatch.length = 0;
          }

          // UPDATE PROGRESS

          if (count % 10000 === 0) {

            console.log(
              `Processed ${count.toLocaleString()} rows`,
            );

            await this.uploadRepo
              .update(uploadId, {

                processedRows:
                  count,

                insertedTracks,

                insertedAlbums,

                status:
                  'processing',
              });
          }
        }
      }

      // FINAL SAVE

      if (trackBatch.length > 0) {

        await this.trackService
          .insertTracks(
            trackBatch,
          );

        insertedTracks +=
          trackBatch.length;
      }

      if (albumBatch.length > 0) {

        await this.albumService
          .insertAlbums(
            albumBatch,
          );

        insertedAlbums +=
          albumBatch.length;
      }

      // COMPLETE

      await this.uploadRepo
        .update(uploadId, {

          processedRows:
            count,

          insertedTracks,

          insertedAlbums,

          status: 'completed',
        });

      console.log(
        `DONE: ${count.toLocaleString()} rows`,
      );

    } catch (error: any) {

      console.error(error);

      // FAILED

      await this.uploadRepo
        .update(uploadId, {

          status: 'failed',

          error:
            error.message ||
            'Unknown error',
        });
    }
  }
}