import { Injectable,BadRequestException, } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bullmq';

import { Queue } from 'bullmq';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Upload } from './upload.entity';

import {
  CATALOGUE_COLUMNS,
} from '../utils/expected-columns';

import { AuditService } from 'src/audit/audit.service';


import {
  validateColumns,
} from '../utils/validate-columns';

import * as ExcelJS from 'exceljs';
import * as path from 'path';

@Injectable()
export class UploadService {

  constructor(

    @InjectQueue('catalogue')
    private queue: Queue,

    @InjectRepository(Upload)
    private readonly uploadRepo: Repository<Upload>,
    private readonly auditService: AuditService,
  ) {}

  async handleUpload(
    file: Express.Multer.File,
    user : any,
  ) {


    const absolutePath = path.resolve(file.path);

    // =========================
    // VALIDATE FILE HEADERS
    // =========================

    const workbook =
      new ExcelJS.Workbook();

    await workbook.xlsx.readFile(
      absolutePath,
    );

    const worksheet =
      workbook.worksheets[0];

    if (!worksheet) {
      throw new BadRequestException(
        'No worksheet found',
      );
    }

    const headerRow =
      worksheet.getRow(1);

    const headers =
      headerRow.values as any[];

    const normalizedHeaders =
      headers.map((h) =>
        String(h || '').trim(),
      );

  

      // VALIDATE COLUMNS
      const validation =
        validateColumns(
          normalizedHeaders,
          CATALOGUE_COLUMNS,
        );

    if (!validation.valid) {

      throw new BadRequestException({
        message:
                  'Invalid catalogue file uploaded',

                missingColumns:
                  validation.missingColumns,

                unexpectedColumns:
                  validation.unexpectedColumns,

                expectedColumns:
                  CATALOGUE_COLUMNS,
      });
    }

    // CREATE DB RECORD

    const upload =
      await this.uploadRepo.save({

        filename: file.originalname,

        status: 'processing',
      });

    // ADD QUEUE JOB

    const job = await this.queue.add(
      'process-file',
      {
        filePath: file.path,

        uploadId: upload.id,
      },
      {
        attempts: 3,

        backoff: {
          type: 'exponential',
          delay: 5000,
        },

        removeOnComplete: true,

        removeOnFail: false,
      },
    );



    await this.auditService.log({
        userId: user.id,

        userEmail: user.email,

        action: 'UPLOAD_CATALOGUE',

        resource: 'CATALOGUE',

        metadata: {
          fileName:
            file.originalname,
        },
      });


    

    return {

      message:
        'File uploaded successfully',

      uploadId: upload.id,

      jobId: job.id,
    };
  }


  async getUploads() {

    return this.uploadRepo.find({

      order: {
        createdAt: 'DESC',
      },
    });
  }

  async getUpload(id: number) {

    return this.uploadRepo.findOne({

      where: { id },
    });
  }
}