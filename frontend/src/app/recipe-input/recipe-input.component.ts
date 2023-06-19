import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
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
  updatedRecipe : Recipe ={
    id: '',
    title: '',
    readyInMinutes: 0,
    servings: 0,
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
      amount: 0,
      unit: '',
    }],
  };
  dataSource: MatTableDataSource<Ingredients> = new MatTableDataSource<Ingredients>();


  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    //get recipe Ingredients
    this.dataSource = new MatTableDataSource<Ingredients>();
    //Category Filter for Chips Autocomplete

  }
recipeForm!: FormGroup;
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
          console.log(this.recipe?.title);

          //get hours from minutes
          let hours = this.recipe?.readyInMinutes/60;
          hours = Math.round(hours);

          this.recipeForm = this.fb.group({
            id: [''],
            title: [this.recipe?.title],
            readyInMinutes: [this.recipe?.readyInMinutes%60],
            readyInHours: [hours],
            servings: [this.recipe?.servings],
            image: [this.recipe?.image],
            imageType: [this.recipe?.imageType],
            summary: [this.recipe?.summary],
            instructions: [this.recipe?.instructions],

            categories: this.fb.group({
              vegetarian: [this.recipe?.categories.vegetarian],
              vegan: [this.recipe?.categories.vegan],
              glutenFree: [this.recipe?.categories.glutenFree],
              dairyFree: [this.recipe?.categories.dairyFree],
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
        });
      } else {
        console.error('No recipe ID found in route');
      }
    });

  }




  updateRecipe() {
    return 0;
  }

  addIngredient() {
    return 0;
  }

  onSubmit() {
    return;
  }

/*
    updateRecipeData() {
      if (this.updatedRecipe.categories.vegetarian == this.recipe?.categories.vegetarian &&
        this.updatedRecipe.categories.vegan == this.recipe?.categories.vegan &&
        this.updatedRecipe.categories.glutenFree == this.recipe?.categories.glutenFree &&
        this.updatedRecipe.categories.dairyFree == this.recipe?.categories.dairyFree) {

        return;
      }

      const recipeDiet: Diet = {
        vegan: this.updatedRecipe.categories.vegan,
        vegetarian: this.updatedRecipe.categories.vegetarian,
        glutenFree: this.updatedRecipe.categories.glutenFree,
        dairyFree: this.updatedRecipe.categories.dairyFree
      }
      this.recipeService.patchRecipeData(this.recipe).subscribe(data => {
        this.recipe?.categories.vegetarian = data.vegetarian;
        this.recipe?.categories.vegan = data.vegan;
        this.recipe?.categories.glutenFree = data.glutenFree;
        this.recipe?.categories.dairyFree = data.dairyFree;

      });
    }*/

  //get the checkbox value
    updateDiet(diet: MatChipSelectionChange, dietName: string) {
    if(this.recipe){ //if weil recipe nicht optional sein darf
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
