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
  fileName?: string = "";
  formData = new FormData();


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
          title: ['', Validators.required],
          readyInMinutes: [0],
          //readyInHours: [hours],
          servings: [1],
          image: [''],
          //imageType: [this.recipe?.imageType],
          imageId: [0],
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
          imageId: 0,
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


  getIngredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  onSubmit() {
    console.log(this.newRecipe);
    //
    if (this.newRecipe) {
      console.log('new recipe');

      //get imageid
      console.log(this.formData);

      if(this.formData.has('image')){
        this.recipeService.postCustomRecipeImage(this.formData).subscribe(imageId => {
          console.log(`create a new ImageId for an new Image `+imageId);
          if (imageId.id >= 0) {
            console.log("image id greater 0");
            // set imageid manually
            this.recipeForm.controls['image'].setValue(imageId.id);  // later set image to image id. backend has to change the parameters
            console.log(`set recipeForm image to imageid` + this.recipeForm.controls['image'].value);
          }
          this.recipeService.postRecipe(this.recipeForm.value as Recipe).subscribe(data => {
            console.log(`posted new recipe with this data` + data);
          });
        });

      }
      else{
        this.recipeService.postRecipe(this.recipeForm.value as Recipe).subscribe(data => {
          console.log(`posted new recipe with this data` + data);
        });
      }



      console.info('new recipe post');
      //route to cookbook
    }
    //recipe update
    if (!this.newRecipe) {
      console.log('update a recipe');
      console.log(this.recipe);
    //image already set
      if (!(this.recipe!.imageId == undefined) || (this.recipe!.imageId == 0)) {
        //override image
        this.recipeService.putCustomRecipeImage(this.formData, this.recipe!.imageId!).subscribe(data => { //this.recipeForm.controls['imageId'].value
          console.log(`Put Image with`+ this.formData +`and getting back`+ data);
          //patch recipe
          this.recipeService.patchRecipeWithId(this.recipeForm.value as Recipe).subscribe(data => {
            console.log(data);
            console.info('recipe patched');
          });
        });
      //image not set
      } else {
        //create new image and get id
        this.recipeService.postCustomRecipeImage(this.formData).subscribe(imageId => {
          console.log(`Posted Image and get imageId back`+imageId.id);
          if (imageId.id >= 0) {
            console.log("image id greater 0");
            // set imageid manually
            this.recipeForm.controls['image'].setValue(imageId.id);  // later set image to image id. backend has to change the parameters
            console.log(`set image value to`+ this.recipeForm.controls['image'].value );
          }
          //patch recipe
          this.recipeService.patchRecipeWithId(this.recipeForm.value as Recipe).subscribe(data => {
            console.log(data);
            console.info('recipe patched');
          });
        });
      }
      return;
    }
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


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.formData.append("image", file);
    }
  }

}
