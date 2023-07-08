import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RecipeService} from "../services/recipe.service";
import {Recipe} from "../models/recipe";
import {ActivatedRoute, Router} from "@angular/router";
import {MatChipSelectionChange} from "@angular/material/chips";
import {CreateRecipe} from "../models/create-recipe";
import {NavigateService} from "../services/navigate.service";


@Component({
  selector: 'app-recipe-input',
  templateUrl: './recipe-input.component.html',
  styleUrls: ['./recipe-input.component.scss'],
})

export class RecipeInputComponent implements OnInit {
  recipe?: Recipe;
  fileName?: string = "";
  formData = new FormData();


  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private navigateService: NavigateService,
  ) {
  }

  recipeForm!: FormGroup;
  newRecipe?: boolean;


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const recipeId = params.get('id');

      this.recipeForm =
        this.fb.group({
          id: [''],
          title: ['', Validators.required],
          readyInMinutes: [0],
          servings: [1],
          image: [''],
          imageId: [undefined],
          summary: ['', Validators.required],
          instructions: ['', Validators.required],

          categories: this.fb.group({
            vegetarian: [false],
            vegan: [false],
            glutenFree: [false],
            dairyFree: [false],
          }),
          ingredients: this.fb.array([
            this.fb.group({
              id: [''],
              name: ['', Validators.required],
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
          readyInMinutes: 1,
          servings: 1,
          image: '',
          imageId: undefined,
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
      }
    });
  }

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


  getIngredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  onSubmit() {

    //new recipe
    if (this.newRecipe) {

      //image uploaded by user
      if (this.formData.has('image')) {
        this.recipeService.postCustomRecipeImage(this.formData).subscribe(imageId => {

          if (imageId.id >= 0) {

            // set imageid manually
            this.recipeForm.controls['imageId'].setValue(imageId.id);
          }
          this.recipeService.postRecipe(this.recipeForm.value as CreateRecipe).subscribe(() => {
            console.debug('New Recipe created');
          });
        });
      //image not uploaded by user
      } else {
        this.recipeService.postRecipe(this.recipeForm.value as CreateRecipe).subscribe(() => {
          console.debug('New Recipe created')
        });
      }


    }
    //recipe update
    if (!this.newRecipe && this.recipe) {


      //set image
      if (this.formData.has('image')) {
        //image already set
        if (this.recipe.imageId) {

          //override image
          this.recipeService.putCustomRecipeImage(this.formData, this.recipe.imageId).subscribe(() => {

            //patch recipe
            this.recipeService.patchRecipeWithId(this.recipeForm.value as CreateRecipe).subscribe(() => {

              console.debug('recipe patched');
            });
          });
          //image not set
        } else {
          //create new image and get id
          this.recipeService.postCustomRecipeImage(this.formData).subscribe(imageId => {

            if (imageId.id >= 0) {

              // set imageId manually
              this.recipeForm.controls['imageId'].setValue(imageId.id);

            }
            //patch recipe
            this.recipeService.patchRecipeWithId(this.recipeForm.value as CreateRecipe).subscribe(() => {

              console.debug('recipe patched');
            });
          });
        }
      } else {
        //patch recipe
        this.recipeService.patchRecipeWithId(this.recipeForm.value as CreateRecipe).subscribe(() => {

          console.debug('recipe patched');
        });
      }


    }
    this.openRecipeBook();
    return;
  }
  openRecipeBook(): void {
    const endpoint = `/cookbook`;
    this.navigateService.navigateTo(this.router.url, endpoint);
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


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file: File = input.files[0];
      if (file) {
        this.fileName = file.name;
        this.formData.set("image", file);
      }
    }
  }


  deleteImage() {
    if (this.recipe) {

      this.formData.delete("image");
      this.recipe.imageId = null;
      this.recipe.image = "";
      this.recipeForm.controls['imageId'].setValue(null);
      this.fileName = '';

      console.debug('Image deleted!');


    }

  }

}
