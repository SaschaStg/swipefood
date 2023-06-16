import {Component} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {FormBuilder, FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from "@angular/material/select";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-recipe-input',
  templateUrl: './recipe-input.component.html',
  styleUrls: ['./recipe-input.component.scss'],
  standalone: true,
  imports: [MatTabsModule, MatSelectModule, MatChipsModule, ReactiveFormsModule, MatButtonModule, MatCardModule, MatIconModule],
})

export class RecipeInputComponent {
  constructor(private fb: FormBuilder) {
  }

  recipeForm = this.fb.group({
    id: [''],
    title: [''],
    readyInMinutes: [''],
    readyInHoures: [''], //must be multiplied by 60 and added to the Minutes
    servings: [''],
    image: [''],
    imageType: [''],
    summary: [''],
    instructions: [''],

    categories: this.fb.group({
      vegetarian: [''],
      vegan: [''],
      glutenFree: [''],
      dairyFree: [''],
    }),

    extendedIngredients: this.fb.group({
      id: [''],
      name: [''],
      amount: [''],
      unit: ['']
    })
});

recipe = new FormControl('');

// for testing the values
amount = new FormControl('');
ingredient = new FormControl('');
instructions = new FormControl('');

updateRecipe()
{
  return 0;
}
addIngredient(){
  return 0;
}

}
