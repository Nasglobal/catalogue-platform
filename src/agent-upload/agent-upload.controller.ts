import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import { AgentUploadService } from './agent-upload.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Public()
@Controller('agents/upload')
export class AgentUploadController {

  constructor(
    private readonly uploadService: AgentUploadService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file'),
  )
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
    @CurrentUser() user,
  ) {

    console.log('AGENT FILE:', file);

    return this.uploadService.handleUpload(file,user);
  }
}