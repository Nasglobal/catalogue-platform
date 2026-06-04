import { Injectable,BadRequestException } from '@nestjs/common';

import { InjectQueue } from '@nestjs/bullmq';

import { Queue } from 'bullmq';

import {
  AGENT_COLUMNS,
} from '../utils/expected-columns';

import {
  validateColumns,
} from '../utils/validate-columns';

import { AuditService } from 'src/audit/audit.service';

import * as ExcelJS from 'exceljs';
import * as path from 'path';

@Injectable()
export class AgentUploadService {

  constructor(

    @InjectQueue('agent-upload')
    private readonly queue: Queue,
    private readonly auditService: AuditService,
  ) {}

  async handleUpload(
    file: Express.Multer.File,
    user:any
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
              AGENT_COLUMNS,
            );
    
        if (!validation.valid) {
    
          throw new BadRequestException({
            message:
                      'Invalid Label Agents file uploaded',
    
                    missingColumns:
                      validation.missingColumns,
    
                    unexpectedColumns:
                      validation.unexpectedColumns,
    
                    expectedColumns:
                      AGENT_COLUMNS,
          });
        }
    

    const job = await this.queue.add(
      'process-agent-file',

      {
        filePath: file.path,
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

        action: 'UPLOAD_AGENT_FILE',

        resource: 'AGENT',

        metadata: {
          fileName:
            file.originalname,
        },
      });

    return {
      message:
        'Agent upload started',

      jobId: job.id,
    };
  }
}