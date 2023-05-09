import { Injectable } from '@nestjs/common';
import { SpoonacularRecipe } from './spoonacular';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import { AxiosRequestConfig } from 'axios';
import { readFileSync } from 'fs';

@Injectable()
export class SpoonacularService {
  private readonly spoonacularApiEndpoint = 'https://api.spoonacular.com';

  private readonly requestConfig: AxiosRequestConfig;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    let apiKey = configService.get<string>('SPOONACULAR_API_KEY');
    if (!apiKey) {
      apiKey = readFileSync(
        configService.getOrThrow<string>('SPOONACULAR_API_KEY_FILE'),
        'utf-8',
      );
    }

    this.requestConfig = {
      headers: {
        'x-api-key': apiKey,
      },
    };
  }

  getSpoonacularRecipeById(id: number): Observable<SpoonacularRecipe> {
    return this.httpService
      .get<SpoonacularRecipe>(
        `${this.spoonacularApiEndpoint}/recipes/${id}/information`,
        this.requestConfig,
      )
      .pipe(map((response) => response.data));
  }
}
