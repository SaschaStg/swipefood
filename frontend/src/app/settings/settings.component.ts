import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";
import {User} from "../services/user";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MatChipSelectionChange} from "@angular/material/chips";
import {UpdateUser} from "../services/updateUser";
import {SnackBarService} from "../services/snackbar.service";
import {Router} from "@angular/router";
import {AuthService, UpdateCredentialsDto} from "../auth/auth.service";
import {AuthResult} from "../auth/auth-result";

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
    vegetarian: new FormControl(),
    vegan: new FormControl(),
    glutenFree: new FormControl(),
    dairyFree: new FormControl(),
  });

  UserCredentials = new FormGroup({
    currentPassword: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    newPassword: new FormControl('', {nonNullable: true}),
    username: new FormControl('', {nonNullable: true}),
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

  updateCredentials() {
    const updateCredentials: UpdateCredentialsDto = {
      currentPassword: this.UserCredentials.get('currentPassword')?.value || "",
      newPassword: this.UserCredentials.get('newPassword')?.value,
      newUsername: this.UserCredentials.get('username')?.value,
    }
    if (updateCredentials.newPassword == updateCredentials.currentPassword) {
      this.snackBarService.openSnackBar("New password cannot be the same as the old one!", 'warn');
      return;
    }
    this.authService.updateCredentials(updateCredentials).subscribe(result => {
      switch (result) {
        case AuthResult.Ok:
          this.snackBarService.openSnackBar("Saved Changes!");
          break;
        case AuthResult.WrongCredentials:
          this.snackBarService.openSnackBar("Wrong Credentials!", 'warn');
          break;
        case AuthResult.ServerError:
          this.snackBarService.openSnackBar("Server Error!", 'warn');
          break;
        case  AuthResult.NetworkError:
          this.snackBarService.openSnackBar("Network Error!", 'warn');
          break;
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

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
