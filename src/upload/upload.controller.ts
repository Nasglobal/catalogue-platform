import {

  Controller,

  Post,

  UploadedFile,

  UseInterceptors,

  Get,

  Param,


} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import { UploadService } from './upload.service';

import { Public } from 'src/auth/decorators/public.decorator';

import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Public()
@Controller('upload')
export class UploadController {

  constructor(

    private readonly uploadService:
      UploadService,
  ) {}

  @Post()

  @UseInterceptors(

    FileInterceptor('file', {

      storage: diskStorage({

        destination: './uploads',

        filename: (
          req,
          file,
          cb,
        ) => {

          cb(
            null,

            `${Date.now()}-${file.originalname}`,
          );
        },
      }),
    }),
  )

  async uploadFile(
    @UploadedFile()
      file: Express.Multer.File,
    @CurrentUser() user,
    ) {

      return this.uploadService.handleUpload(file,user);
    }

    // ALL UPLOADS

  @Get()

  async getUploads() {

    return this.uploadService
      .getUploads();
  }

  // SINGLE UPLOAD

  @Get(':id')

  async getUpload(

    @Param('id')
    id: string,
    ) {

      return this.uploadService
        .getUpload(Number(id));
    }
}