import {Component} from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-recipe-input',
  templateUrl: './recipe-input.component.html',
  styleUrls: ['./recipe-input.component.scss'],
  standalone: true,
  imports: [MatTabsModule],
})
export class RecipeInputComponent {
  recipe = new FormControl('');
}
