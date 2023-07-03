import { SpoonacularIngredient } from '../spoonacular';
import { SwipefoodIngredient } from '../ingredient.entity';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class IngredientDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  unit: string;

  constructor(id: string, name: string, amount: number, unit: string) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.unit = unit;
  }

  static fromSpoonacularIngredient(
    ingredient: SpoonacularIngredient,
  ): IngredientDto {
    return new IngredientDto(
      `sp-${ingredient.id}`,
      ingredient.name,
      ingredient.measures.metric.amount,
      ingredient.measures.metric.unitShort,
    );
  }

  static fromSwipefoodIngredient(ingredient: SwipefoodIngredient) {
    return new IngredientDto(
      `sw-${ingredient.id}`,
      ingredient.name,
      ingredient.amount,
      ingredient.unit,
    );
  }
}
