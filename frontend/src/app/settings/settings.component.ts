import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../services/user";
import {FormControl, FormGroup} from '@angular/forms';
import {MatChipSelectionChange} from "@angular/material/chips";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UpdateUser} from "../services/updateUser";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  user: User = {id: 0, displayName: "", dairyFree: false, glutenFree: false, vegan: false, vegetarian: false};
  updatedUser: User = {id: 0, displayName: "", dairyFree: false, glutenFree: false, vegan: false, vegetarian: false};

  UserData = new FormGroup({
    displayName: new FormControl('', {nonNullable: true}),
    password: new FormControl('fooBar', {nonNullable: true}),
    vegetarian: new FormControl(),
    vegan: new FormControl(),
    glutenFree: new FormControl(),
    dairyFree: new FormControl(),
  });

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
    this.userService.getUserName().subscribe(data => {
      this.user = data;
      this.UserData.patchValue({
        displayName: data.displayName,
        vegetarian: data.vegetarian,
        vegan: data.vegan,
        glutenFree: data.glutenFree,
        dairyFree: data.dairyFree,
      });
    });
  }

  updateUserData() {
    if (
      this.UserData.get('displayName')?.value == this.user.displayName &&
      this.updatedUser.vegetarian == this.user.vegetarian &&
      this.updatedUser.vegan == this.user.vegan &&
      this.updatedUser.glutenFree == this.user.glutenFree &&
      this.updatedUser.dairyFree == this.user.dairyFree
    ) {
      this.openSnackBar("No changes detected", "warn");
      return;
    }
    const updateUser: UpdateUser = {
      displayName: this.UserData.get('displayName')?.value,
      vegan: this.updatedUser.vegan,
      vegetarian: this.updatedUser.vegetarian,
      glutenFree: this.updatedUser.glutenFree,
      dairyFree: this.updatedUser.dairyFree
    }
    this.userService.patchUserDiet(updateUser).subscribe(data => {
      this.user.displayName = data.displayName;
      this.user.vegetarian = data.vegetarian;
      this.user.vegan = data.vegan;
      this.user.glutenFree = data.glutenFree;
      this.user.dairyFree = data.dairyFree;
      this.openSnackBar("Saved Changes!");
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

  openSnackBar(message: string, style?: string) {
    const snackbarStyle = style == "warn" ? "snackbarWarn" : "snackbarPrimary";
    const sbRef = this.snackBar.open(
      message, 'Close', {
        duration: 4000,
        panelClass: [snackbarStyle],
      })
    sbRef.onAction().subscribe(() => {
      sbRef.dismiss();
    });
  }
}
