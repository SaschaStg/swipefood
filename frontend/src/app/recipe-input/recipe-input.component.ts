import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {RecipeService} from "../services/recipe.service";
import {Recipe} from "../models/recipe";
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {Ingredients} from "../models/ingredients";
import {Diet} from "../services/diet";
import {MatChipSelectionChange} from "@angular/material/chips";


@Component({
  selector: 'app-recipe-input',
  templateUrl: './recipe-input.component.html',
  styleUrls: ['./recipe-input.component.scss'],
})

export class RecipeInputComponent implements OnInit {
  recipe?: Recipe;


  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  recipeForm!: FormGroup;
  newRecipe?: boolean;

  ngOnInit() {
    console.log(this.recipe);
    this.route.paramMap.subscribe(params => {
      const recipeId = params.get('id');

      this.recipeForm =
        this.fb.group({
          id: [''],
          title: [''],
          readyInMinutes: [0],
          //readyInHours: [hours],
          servings: [1],
          //image: [this.recipe?.image],
          //imageType: [this.recipe?.imageType],
          summary: [''],
          instructions: [''],

          categories: this.fb.group({
            vegetarian: [false],
            vegan: [false],
            glutenFree: [false],
            dairyFree: [false],
          }),
          ingredients: this.fb.array([
            this.fb.group({
              id: [''],
              name: [''],
              amount: ['1'],
              unit: ['']
            }),
          ])
        });

      if (recipeId) {
        this.newRecipe = false;
        this.recipeService.getRecipeById(recipeId).subscribe(data => {
          this.recipe = data;
          this.recipeForm.patchValue(this.recipe);
          this.loadIngredient();
        });

      } else {
        this.newRecipe = true;
        this.recipe = {
          id: '',
          title: '',
          readyInMinutes: 0,
          servings: 1,
          image: '',
          imageType: '',
          summary: '',
          instructions: '',
          categories: {
            vegetarian: false,
            vegan: false,
            glutenFree: false,
            dairyFree: false,
          },
          ingredients: [{
            id: 0,
            name: '',
            amount: 1,
            unit: '',
          },]
        }
        this.recipeForm.patchValue(this.recipe);
        console.error('No recipe ID found in route');
      }
    });

  }

// helper for the form


  newIngredient(): FormGroup {
    return this.fb.group({
      id: [''],
      name: [''],
      amount: [''],
      unit: ['']
    })

  }


  addIngredient() {
    this.getIngredients().push(this.newIngredient());
  }

  loadIngredient() {

    this.recipeForm.setControl('ingredients', this.fb.array(this.recipe?.ingredients?.map((ingredient) =>
        this.fb.group({
          id: [ingredient.id],
          name: [ingredient.name],
          amount: [ingredient.amount],
          unit: [ingredient.unit]
        }),
      ) ?? [])
    )
  }

  removeIngredient(index: number) {
    this.getIngredients().removeAt(index);
  }

  updateRecipe() {
    return 0;
  }


  getIngredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  onSubmit() {
    console.log(this.newRecipe);
    if (this.newRecipe) {
      this.recipeService.postRecipe(this.recipeForm.value as Recipe).subscribe(data => {
        console.log(data)
      });
      console.info('new recipe post');
      //route to cookbook
    }
    if (!this.newRecipe) {
      this.recipeService.patchRecipeWithId(this.recipeForm.value as Recipe).subscribe(data => {
        console.log(data)
      });
      console.info('recipe patched');
    }

    return;
  }

  //get the checkbox value
  updateDiet(diet: MatChipSelectionChange, dietName: string) {
    if (this.recipe) { 
      switch (dietName) {
        case 'vegetarian':
          this.recipe.categories.vegetarian = diet.selected;
          break;
        case 'vegan':
          this.recipe.categories.vegan = diet.selected;
          break;
        case 'glutenFree':
          this.recipe.categories.glutenFree = diet.selected;
          break;
        case 'dairyFree':
          this.recipe.categories.dairyFree = diet.selected;
          break;
      }
    }
  }
}
