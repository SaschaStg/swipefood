import { DynamicModule, Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';
import { RecipesModule } from '../recipes/recipes.module';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';

@Module({})
export class DemoModule {
  static register(): DynamicModule {
    const module: DynamicModule = {
      module: DemoModule,
      imports: [],
      controllers: [],
      providers: [],
    };

    // Create a local instance of ConfigService to access environment variables
    const config = new ConfigService();

    // Enable demo if DEMO_ENABLED is set to a non-empty value
    if (!!config.get('DEMO_ENABLED')) {
      module.imports.push(AuthModule, RecipesModule);
      module.controllers.push(DemoController);
      module.providers.push(DemoService);
    }
    return module;
  }
}
