import { IsBoolean } from 'class-validator';

export class SwipeDto {
  @IsBoolean()
  isLiked: boolean;
}
