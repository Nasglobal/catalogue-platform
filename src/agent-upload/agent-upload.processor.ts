import {
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';

import { Job } from 'bullmq';

import * as ExcelJS from 'exceljs';

import * as path from 'path';

import { AgentService } from '../agent/agent.service';

import {
  AGENT_COLUMNS,
} from '../utils/expected-columns';

import {
  validateColumns,
} from '../utils/validate-columns';

@Processor('agent-upload')
export class AgentUploadProcessor
  extends WorkerHost {

  constructor(
    private readonly agentService: AgentService,
  ) {
    super();
  }

  async process(job: Job) {

    console.log(
      '🔥 AGENT PROCESSOR STARTED',
    );

    const absolutePath = path.resolve(
      job.data.filePath,
    );

    console.log(
      'Processing:',
      absolutePath,
    );

    const workbook =
      new ExcelJS.stream.xlsx.WorkbookReader(
        absolutePath,
        {},
      );

    const agentBatch: any[] = [];

    const BATCH_SIZE = 2000;

    let count = 0;

    let columnMap: Record<string, number> =
      {};

    let isHeaderProcessed = false;

    for await (const worksheet of workbook) {

      console.log(
        'Worksheet detected',
      );

      for await (const row of worksheet) {

        count++;

        const values =
          row.values as any[];

        // ================= HEADER =================

        if (!isHeaderProcessed) {

            const uploadedHeaders: string[] =
              [];

            values.forEach(
              (cell: any, index: number) => {

                if (!cell) return;

                let header = '';

                if (
                  typeof cell === 'object'
                ) {

                  header = String(
                    cell.text ||
                    cell.value ||
                    '',
                  ).trim();
                } else {

                  header =
                    String(cell).trim();
                }

                uploadedHeaders.push(header);

                columnMap[header] = index;
              },
            );

            const validation =
              validateColumns(
                uploadedHeaders,
                AGENT_COLUMNS,
              );

            if (!validation.valid) {

              throw new Error(
                JSON.stringify({
                  message:
                    'Invalid agent file',

                  missingColumns:
                    validation.missingColumns,

                  unexpectedColumns:
                    validation.unexpectedColumns,

                  expectedColumns:
                    AGENT_COLUMNS,
                }),
              );
            }

            isHeaderProcessed = true;


            continue;
          }

        // ================= GETTER =================

        const get = (name: string) => {

          const index =
            columnMap[name];

          const cell = values[index];

          if (!cell) return null;

          if (
            typeof cell === 'object'
          ) {

            return (
              cell.text ||
              cell.value ||
              null
            );
          }

          return cell;
        };

        // ================= INSERT =================

        agentBatch.push({

          zkp_Label:
            get('zkp_Label'),

          labelNamePkt:
            get('LabelName_pkt'),

          labelRoyaltyRate:
            Number(
              get(
                'LabelRoyaltyRate',
              ),
            ) || null,

          currencyPreferred:
            get(
              'CurrencyPreferred',
            ),

          labelStatus:
            get('LabelStatus'),

          contractStartDate:
            get(
              'ContractStartDate',
            ),

          contractEndDate:
            get(
              'ContractEndDate',
            ),

          nameFirst:
            get('NameFirst'),

          nameLast:
            get('NameLast'),

          email1: get('Email1'),

          email2: get('Email2'),

          email3: get('Email3'),

          labelPhone:
            get('LabelPhone'),

          addressLine1:
            get('AddressLine1'),

          addressCityState:
            get(
              'AddressCityState',
            ),

          addressCountry:
            get(
              'AddressCountry',
            ),

          addressZipCode:
            get(
              'AddressZipCode',
            ),
        });

        // ================= SAVE =================

        if (
          agentBatch.length >=
          BATCH_SIZE
        ) {

          console.log(
            `Saving ${agentBatch.length} agents`,
          );

          await this.agentService.insertAgents(
            agentBatch,
          );

          agentBatch.length = 0;
        }

        // ================= LOG =================

        if (count % 1000 === 0) {

          console.log(
            `Processed ${count.toLocaleString()} agent rows`,
          );
        }
      }
    }

    // ================= FINAL SAVE =================

    if (agentBatch.length > 0) {

      await this.agentService.insertAgents(
        agentBatch,
      );
    }

    console.log(
      `DONE: ${count.toLocaleString()} agent rows`,
    );
  }
}