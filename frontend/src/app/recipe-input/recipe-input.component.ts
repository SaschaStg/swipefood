import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {RecipeService} from "../services/recipe.service";
import {Recipe} from "../models/recipe";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {Ingredients} from "../models/ingredients";


@Component({
  selector: 'app-recipe-input',
  templateUrl: './recipe-input.component.html',
  styleUrls: ['./recipe-input.component.scss'],
})

export class RecipeInputComponent implements OnInit {
  recipe?: Recipe;
  dataSource: MatTableDataSource<Ingredients> = new MatTableDataSource<Ingredients>();


  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
  )
  {
    //get recipe Ingredients
    this.dataSource = new MatTableDataSource<Ingredients>();
    //Category Filter for Chips Autocomplete

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const recipeId = params.get('id');
      console.log(params);

      if (recipeId) {
        this.recipeService.getRecipeById(recipeId).subscribe(data => {
          this.recipe = data;
          console.log(data);

          this.dataSource.data = this.recipe.ingredients.map(ingredient => {
            return {
              amount: ingredient.amount,
              unit: ingredient.unit,
              name: ingredient.name
            };
          });
        });
      } else {
        console.error('No recipe ID found in route');
      }
    });
  }

  recipeForm = this.fb.group({
    id: [''],
    title: [this.recipe?.title],
    readyInMinutes: ['300'],
    readyInHours: [''], //must be multiplied by 60 and added to the Minutes
    servings: ['4'],
    image: [''],
    imageType: [''],
    summary: ['blablablabal'],
    instructions: ['zuerst das dann das und dann das'],

    categories: this.fb.group({
      vegetarian: [''],
      vegan: [''],
      glutenFree: [''],
      dairyFree: [''],
    }),

    extendedIngredients: this.fb.group({
        id: ['1'],
        name: ['Karotte'],
        amount: ['5'],
        unit: ['stück']
      },
    )
  })
  ;


  updateRecipe() {
    return 0;
  }

  addIngredient() {
    return 0;
  }

  onSubmit(){
    return;
  }


}
