import { Controller, Get, Header, StreamableFile } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { createReadStream } from 'fs';
import * as path from 'path';
import * as process from 'process';
import { Public } from '../auth/public';

@Controller('images')
@ApiTags('images')
@ApiBearerAuth()
export class ImagesController {
  @Get('generic')
  @Public()
  @Header('Content-Type', 'image/jpeg')
  @Header('Content-Disposition', 'inline')
  async getGenericImage() {
    const image = createReadStream(
      path.join(process.cwd(), 'assets', 'recipe_placeholder.jpg'),
    );
    return new StreamableFile(image);
  }
}
