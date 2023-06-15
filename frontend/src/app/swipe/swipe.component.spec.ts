import { ComponentFixture, TestBed } from '@angular/core/testing';
import {SwipeComponent} from "./swipe.component";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatIconModule} from "@angular/material/icon";
import {RecipeService} from "../services/recipe.service";
import {Recipe} from "../models/recipe";

describe('SwipeComponent', () => {
  let component: SwipeComponent;
  let fixture: ComponentFixture<SwipeComponent>;
  let recipeService: RecipeService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
        BrowserModule,
        BrowserAnimationsModule,
        MatIconModule
      ],
      providers: [
        SwipeComponent,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => '1' })
          }
        }
      ],
      declarations: [ SwipeComponent ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SwipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    recipeService = TestBed.inject(RecipeService);
  });

  const mockRecipe: Recipe = {
    id: '1',
    title: 'Recipe 1',
    readyInMinutes: 20,
    servings: 4,
    image: 'recipe1.jpg',
    imageType: 'jpg',
    summary: 'Recipe 1 summary',
    instructions: 'Recipe 1 instructions',
    categories: {
      vegetarian: false,
      vegan: true,
      glutenFree: true,
      dairyFree: false
    },
    ingredients: [
      {
        id: 1,
        name: 'Ingredient 1',
        amount: 2,
        unit: 'cups'
      },
      {
        id: 2,
        name: 'Ingredient 2',
        amount: 3,
        unit: 'tbsp'
      }
    ]
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
