import {Component} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from "@angular/material/select";
import {MatChipsModule} from "@angular/material/chips";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-recipe-input',
  templateUrl: './recipe-input.component.html',
  styleUrls: ['./recipe-input.component.scss'],
  standalone: true,
  imports: [MatTabsModule, MatSelectModule, MatChipsModule, ReactiveFormsModule, MatButtonModule],
})

export class RecipeInputComponent {
  recipe = new FormControl('');
  houres = [
    {value:0.5, viewValue:'0.5h'},
    {value:1, viewValue:'1h'},
    {value:1.5, viewValue:'1.5h'},
    {value:2, viewValue:'2h'},
    {value:2.5, viewValue:'0.5h'},
    {value:3, viewValue:'0.5h'},
    {value:3.5, viewValue:'0.5h'},
    {value:4, viewValue:'0.5h'},
    {value:4.5, viewValue:'0.5h'},
    {value:5, viewValue:'0.5h'},
    ]
 // for testing the values
  amount = new FormControl('');
  ingredient = new FormControl('');
  instructions = new FormControl('');
}
