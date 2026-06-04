import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { BullModule } from '@nestjs/bullmq';
import { UploadProcessor } from './upload.processor';
import { TrackModule } from '../track/track.module';
import { AlbumModule } from '../album/album.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';
import { AuditModule } from 'src/audit/audit.module';

@Module({
  imports: [

    TypeOrmModule.forFeature([
      Upload,
    ]),

    BullModule.registerQueue({
      name: 'catalogue', //  NO connection here
    }),
    TrackModule,
    AlbumModule,
    AuditModule,
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadProcessor],
})
export class UploadModule {}