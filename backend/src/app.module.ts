import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/user.entity';
import { UserLogin } from './auth/user-login.entity';
import { RecipesModule } from './recipes/recipes.module';
import { Swipe } from './recipes/swipe.entity';
import { SwipefoodRecipe } from './recipes/recipe.entity';
import { SwipefoodIngredient } from './recipes/ingredient.entity';
import { ImagesModule } from './images/images.module';
import { DemoModule } from './demo/demo.module';
import { Image } from './images/image.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
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
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    UsersModule,
    AuthModule,
    RecipesModule,
    ImagesModule,
    DemoModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
