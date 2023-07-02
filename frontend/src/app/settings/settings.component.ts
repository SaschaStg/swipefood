import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../services/user";
import {FormControl, FormGroup} from '@angular/forms';
import {MatChipSelectionChange} from "@angular/material/chips";
import {UpdateUser} from "../services/updateUser";
import {SnackBarService} from "../services/snackbar.service";
import {AuthService} from "../auth/auth.service";
import {Router} from "@angular/router";

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
    private snackBarService: SnackBarService,
    public authService: AuthService,
    private router: Router
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
    const updateUser: UpdateUser = {
      displayName: this.UserData.get('displayName')?.value,
      vegan: this.updatedUser.vegan,
      vegetarian: this.updatedUser.vegetarian,
      glutenFree: this.updatedUser.glutenFree,
      dairyFree: this.updatedUser.dairyFree
    }
    this.userService.updateUserInfo(updateUser).subscribe(data => {
      if (data.displayName != null) {
        this.user.displayName = data.displayName;
      }
      console.log(data.displayName, this.user.displayName)
      this.user.vegetarian = data.vegetarian;
      this.user.vegan = data.vegan;
      this.user.glutenFree = data.glutenFree;
      this.user.dairyFree = data.dairyFree;
      this.snackBarService.openSnackBar("Saved Changes!");
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
