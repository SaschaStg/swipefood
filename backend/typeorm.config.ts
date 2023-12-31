import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from './src/users/user.entity';
import { UserLogin } from './src/auth/user-login.entity';
import { CreateUserTables1683148265321 } from './migrations/1683148265321-CreateUserTables';
import { Swipe } from './src/recipes/swipe.entity';
import { CreateSwipeTable1686160681491 } from './migrations/1686160681491-CreateSwipeTable';
import { AddDietPreferences1686162763297 } from './migrations/1686162763297-AddDietPreferences';
import { SwipefoodRecipe } from './src/recipes/recipe.entity';
import { SwipefoodIngredient } from './src/recipes/ingredient.entity';
import { AddCustomRecipes1686773753909 } from './migrations/1686773753909-AddCustomRecipes';
import { Image } from './src/images/image.entity';
import { AddImages1688496202555 } from './migrations/1688496202555-AddImages';

config();

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT', 5432),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [
    User,
    UserLogin,
    Swipe,
    SwipefoodRecipe,
    SwipefoodIngredient,
    Image,
  ],
  migrations: [
    CreateUserTables1683148265321,
    CreateSwipeTable1686160681491,
    AddDietPreferences1686162763297,
    AddCustomRecipes1686773753909,
    AddImages1688496202555,
  ],
});
