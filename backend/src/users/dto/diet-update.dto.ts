import { IsBoolean, IsOptional } from 'class-validator';

/**
 * @deprecated
 */
export class DietUpdateDto {
  @IsOptional()
  @IsBoolean()
  readonly vegetarian?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly vegan?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly glutenFree?: boolean;

  @IsOptional()
  @IsBoolean()
  readonly dairyFree?: boolean;
}
