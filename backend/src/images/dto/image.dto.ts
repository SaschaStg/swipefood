import { IsInt, IsPositive } from 'class-validator';

export class ImageDto {
  @IsInt()
  @IsPositive()
  id: number;
}
