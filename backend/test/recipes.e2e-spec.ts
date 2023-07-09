import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RecipesModule } from '../src/recipes/recipes.module';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { User } from '../src/users/user.entity';
import { UserLogin } from '../src/auth/user-login.entity';
import { CreateRecipeDto, UpdateRecipeDto } from '../src/recipes/dto';
import { SwipefoodRecipe } from '../src/recipes/recipe.entity';
import { SwipefoodIngredient } from '../src/recipes/ingredient.entity';
import { Image } from '../src/images/image.entity';
import { AuthModule } from '../src/auth/auth.module';
import { AuthService } from '../src/auth/auth.service';

describe('RecipesController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  const createdIds: { recipe: string; ingredients: any[] } = {
    recipe: undefined,
    ingredients: [],
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [
            () => ({
              SPOONACULAR_API_KEY: 'disabled',
              JWT_SECRET: 'supersecret',
            }),
          ],
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [
            Image,
            SwipefoodIngredient,
            SwipefoodRecipe,
            User,
            UserLogin,
          ],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([UserLogin, User, Image]),
        AuthModule, // Needed for the authentication providers
        RecipesModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Add global input validation
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );

    // Add cookie-parser
    app.use(cookieParser());

    await app.init();

    const authService = app.get<AuthService>(AuthService);
    const { access_token } = await authService.register({
      username: 'test',
      password: 'secret',
      vegan: false,
      vegetarian: false,
      glutenFree: false,
      dairyFree: false,
      displayName: 'Test User',
    });
    authToken = access_token;
  });

  test('POST /recipes', () => {
    return request(app.getHttpServer())
      .post('/recipes')
      .set('Cookie', [`jwt=${authToken}`])
      .send({
        title: 'Bread with butter',
        summary: 'A delicious bread with butter',
        instructions:
          'Take the slice of bread and spread butter on it. If you like you can add some salt.',
        servings: 1,
        readyInMinutes: 2,
        categories: {
          vegan: false,
          vegetarian: true,
          glutenFree: false,
          dairyFree: false,
        },
        ingredients: [
          {
            name: 'Bread',
            amount: 1,
            unit: 'slice',
          },
          {
            name: 'Butter',
            amount: 1,
            unit: 'tbsp',
          },
        ],
      } as CreateRecipeDto)
      .expect(201)
      .expect((res) => {
        expect(res.body).toMatchObject({
          title: 'Bread with butter',
          summary: 'A delicious bread with butter',
          instructions:
            'Take the slice of bread and spread butter on it. If you like you can add some salt.',
          servings: 1,
          readyInMinutes: 2,
          categories: {
            vegan: false,
            vegetarian: true,
            glutenFree: false,
            dairyFree: false,
          },
          ingredients: [
            {
              name: 'Bread',
              amount: 1,
              unit: 'slice',
            },
            {
              name: 'Butter',
              amount: 1,
              unit: 'tbsp',
            },
          ],
          image: 'api/images/generic',
        });
        expect(res.body.id).toMatch(/sw-\d*/);
        createdIds.recipe = res.body.id;

        for (const ingredient of res.body.ingredients) {
          expect(ingredient.id).toMatch(/sw-\d*/);
          createdIds.ingredients.push(ingredient.id);
        }
      });
  });

  test('GET /recipes/:id', () => {
    return request(app.getHttpServer())
      .get(`/recipes/${createdIds.recipe}`)
      .set('Cookie', [`jwt=${authToken}`])
      .expect(200)
      .expect({
        id: createdIds.recipe,
        title: 'Bread with butter',
        summary: 'A delicious bread with butter',
        instructions:
          'Take the slice of bread and spread butter on it. If you like you can add some salt.',
        servings: 1,
        readyInMinutes: 2,
        categories: {
          vegan: false,
          vegetarian: true,
          glutenFree: false,
          dairyFree: false,
        },
        ingredients: [
          {
            id: createdIds.ingredients[0],
            name: 'Bread',
            amount: 1,
            unit: 'slice',
          },
          {
            id: createdIds.ingredients[1],
            name: 'Butter',
            amount: 1,
            unit: 'tbsp',
          },
        ],
        image: 'api/images/generic',
      });
  });

  test('PATCH /recipes/:id', () => {
    return request(app.getHttpServer())
      .patch(`/recipes/${createdIds.recipe}`)
      .set('Cookie', [`jwt=${authToken}`])
      .send({
        id: createdIds.recipe,
        title: 'Butterbrot',
      } as UpdateRecipeDto)
      .expect(200)
      .expect({
        id: createdIds.recipe,
        title: 'Butterbrot',
        summary: 'A delicious bread with butter',
        instructions:
          'Take the slice of bread and spread butter on it. If you like you can add some salt.',
        servings: 1,
        readyInMinutes: 2,
        categories: {
          vegan: false,
          vegetarian: true,
          glutenFree: false,
          dairyFree: false,
        },
        ingredients: [
          {
            id: createdIds.ingredients[0],
            name: 'Bread',
            amount: 1,
            unit: 'slice',
          },
          {
            id: createdIds.ingredients[1],
            name: 'Butter',
            amount: 1,
            unit: 'tbsp',
          },
        ],
        image: 'api/images/generic',
      });
  });

  test('DELETE /recipes/:id', () => {
    return request(app.getHttpServer())
      .delete(`/recipes/${createdIds.recipe}`)
      .set('Cookie', [`jwt=${authToken}`])
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
