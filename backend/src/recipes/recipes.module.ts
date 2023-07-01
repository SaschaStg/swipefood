import { Module } from '@nestjs/common';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SwipefoodRecipe } from './recipe.entity';
import { SwipefoodIngredient } from './ingredient.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { SpoonacularService } from './spoonacular.service';
import { Swipe } from './swipe.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SwipefoodRecipe, SwipefoodIngredient, Swipe]),
    HttpModule,
    ConfigModule,
    UsersModule,
  ],
  controllers: [RecipesController],
  providers: [RecipesService, SpoonacularService],
  exports: [RecipesService],
})
export class RecipesModule {}
