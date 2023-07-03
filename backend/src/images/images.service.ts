import { Injectable, NotFoundException } from '@nestjs/common';
import * as sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import * as process from 'process';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './image.entity';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { ImageDto } from './dto';

@Injectable()
export class ImagesService {
  private readonly storageDir = path.join(process.cwd(), 'data', 'images');

  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
    private readonly dataSource: DataSource,
  ) {
    // Make sure the storage directory exists
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
  }

  async processNewImage(buffer: Buffer, user: User): Promise<ImageDto> {
    let image = new Image();
    image.owner = user;
    return await this.dataSource.transaction(async (manager) => {
      image = await manager.save(image);
      await this.saveImageToDisk(buffer, image.id);
      return { id: image.id };
    });
  }

  async processUpdatedImage(
    buffer: Buffer,
    id: number,
    user: User,
  ): Promise<ImageDto> {
    const image = await this.getImageFromDb(id, user);
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    await this.saveImageToDisk(buffer, image.id);

    return { id: image.id };
  }

  async getImage(id: number, user: User) {
    const image = await this.getImageFromDb(id, user);
    if (!image) {
      throw new NotFoundException('Image not found');
    }

    try {
      const imagePath = path.join(this.storageDir, `${id}.webp`);
      return fs.createReadStream(imagePath);
    } catch (e) {
      if (e.code === 'ENOENT') {
        // Image not found on disk; delete it from the database
        await this.imageRepository.remove(image);

        throw new NotFoundException('Image not found');
      }
      // File exists but could not be read
      throw e;
    }
  }

  private getImageFromDb(id: number, user: User): Promise<Image | null> {
    return this.imageRepository.findOne({
      where: {
        id: id,
        // Return null if the user is not the owner of the image;
        // this is to prevent users from accessing other users' images.
        // This needs to be changed when we implement sharing recipes
        owner: { id: user.id },
      },
    });
  }

  private async saveImageToDisk(buffer: Buffer, id: number) {
    await sharp(buffer)
      .webp()
      .toFile(path.join(this.storageDir, `${id}.webp`));
  }
}
