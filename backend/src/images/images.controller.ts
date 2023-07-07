import {
  Controller,
  Get,
  Header,
  Param,
  ParseFilePipeBuilder,
  ParseIntPipe,
  Post,
  Put,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { createReadStream } from 'fs';
import * as path from 'path';
import * as process from 'process';
import { Public } from '../auth/public';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { ReqUser } from '../auth/user.decorator';
import { User } from '../users/user.entity';
import { Response } from 'express';

const maxImageSize = 2 * 1000 * 1000; // 2 MB

class ImageUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: any;
}

@Controller('images')
@ApiTags('images')
@ApiCookieAuth()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get('generic')
  @Header('Content-Type', 'image/jpeg')
  @Header('Content-Disposition', 'inline')
  async getGenericImage() {
    const image = createReadStream(
      path.join(process.cwd(), 'assets', 'recipe_placeholder.jpg'),
    );
    return new StreamableFile(image);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    type: ImageUploadDto,
  })
  async uploadImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: maxImageSize,
        })
        .build(),
    )
    file: Express.Multer.File,
    @ReqUser() user: User,
  ) {
    return await this.imagesService.processNewImage(file.buffer, user);
  }

  @Get(':id')
  async getImage(
    @Param('id', ParseIntPipe) id: number,
    @ReqUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const image = await this.imagesService.getImage(id, user);
    res.set({
      'Content-Type': 'image/webp',
      'Content-Disposition': 'inline',
    });
    return new StreamableFile(image);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file',
    type: ImageUploadDto,
  })
  async updateImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: maxImageSize,
        })
        .build(),
    )
    file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number,
    @ReqUser() user: User,
  ) {
    await this.imagesService.processUpdatedImage(file.buffer, id, user);
  }
}
