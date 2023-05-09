import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwipefoodRecipe } from './recipe.entity';
import { SwipefoodIngredient } from './ingredient.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SpoonacularService } from './spoonacular.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SwipefoodRecipe, SwipefoodIngredient]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService, SpoonacularService],
})
export class RecipesModule {}
