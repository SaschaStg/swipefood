import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../services/user";
import {FormControl, FormGroup} from '@angular/forms';
import {Diet} from "../services/diet";
import {MatChipSelectionChange} from "@angular/material/chips";
import {SnackBarService} from "../services/snackbar.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  user: User = {dairyFree: false, displayName: "", glutenFree: false, id: 0, vegan: false, vegetarian: false};
  updatedUser: User = {dairyFree: false, displayName: "", glutenFree: false, id: 0, vegan: false, vegetarian: false};

  UserData = new FormGroup({
    displayName: new FormControl('fooBar'),
    password: new FormControl('fooBar'),
    vegetarian: new FormControl(),
    vegan: new FormControl(),
    glutenFree: new FormControl(),
    dairyFree: new FormControl(),
  });

  constructor(
    private userService: UserService,
    private snackBarService: SnackBarService,
  ) {

  }

  ngOnInit(): void {
    this.userService.getUserName().subscribe({
      next: (data) => {
        this.user = data;
        this.UserData.patchValue({
          displayName: data.displayName + " !WIP! (not yet implemented)",
          vegetarian: data.vegetarian,
          vegan: data.vegan,
          glutenFree: data.glutenFree,
          dairyFree: data.dairyFree,
        });
      },
      error: (err) => {
        this.snackBarService.openSnackBar("can´t load user data!", "warn");
        console.log(err)
      }
    });
  }

  updateUserData() {
    if (this.updatedUser.vegetarian == this.user.vegetarian &&
      this.updatedUser.vegan == this.user.vegan &&
      this.updatedUser.glutenFree == this.user.glutenFree &&
      this.updatedUser.dairyFree == this.user.dairyFree) {
      this.snackBarService.openSnackBar("No changes detected", "warn");
      return;
    }
    const userDiet: Diet = {
      vegan: this.updatedUser.vegan,
      vegetarian: this.updatedUser.vegetarian,
      glutenFree: this.updatedUser.glutenFree,
      dairyFree: this.updatedUser.dairyFree
    }
    this.userService.patchUserDiet(userDiet).subscribe({
      next: (data) => {
        this.user.vegetarian = data.vegetarian;
        this.user.vegan = data.vegan;
        this.user.glutenFree = data.glutenFree;
        this.user.dairyFree = data.dairyFree;
        this.snackBarService.openSnackBar("Saved Changes!");
      },
      error: (err) => {
        this.snackBarService.openSnackBar("can´t update user data!", "warn");
        console.log(err)
      }
    });
  }

  //get the checkbox value
  updateDiet(diet: MatChipSelectionChange, dietName: string) {
    switch (dietName) {
      case 'vegetarian':
        this.updatedUser.vegetarian = diet.selected;
        break;
      case 'vegan':
        this.updatedUser.vegan = diet.selected;
        break;
      case 'glutenFree':
        this.updatedUser.glutenFree = diet.selected;
        break;
      case 'dairyFree':
        this.updatedUser.dairyFree = diet.selected;
        break;
    }
  }

}
