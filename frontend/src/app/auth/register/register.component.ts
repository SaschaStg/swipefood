import {Component} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthResult} from "../auth-result";
import {MatChipSelectionChange} from "@angular/material/chips";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
  }

  registerForm = new FormGroup({
    username: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
    password: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
    displayName: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
    vegan: new FormControl<boolean>(true),
    vegetarian: new FormControl<boolean>(true),
    glutenFree: new FormControl<boolean>(true),
    dairyFree: new FormControl<boolean>(true),
  });

  onSubmit(): void {
    const {
      username, password, displayName,
      vegan, vegetarian, glutenFree, dairyFree
    } = this.registerForm.value;
    this.registerForm.disable();

    this.authService.register({
      username: username ?? '',
      password: password ?? '',
      displayName: displayName ?? '',
      vegan: vegan ?? false,
      vegetarian: vegetarian ?? false,
      glutenFree: glutenFree ?? false,
      dairyFree: dairyFree ?? false,
    }).subscribe(result => {
      switch (result) {
        case AuthResult.Ok:
          this.openSnackBar('Registration successful!');
          this.router.navigate(['']);
          return;
        case AuthResult.WrongCredentials:
          // Username is already taken
          console.error('Username is already taken.');
          this.openSnackBar('Username is already taken.', 'warn');
          break;
        case AuthResult.ServerError:
        case AuthResult.NetworkError:
          console.error(`Could not register: ${result === AuthResult.NetworkError ? 'network error' : 'server error'}`);
          this.openSnackBar(`Could not register: ${result === AuthResult.NetworkError ? 'network error' : 'server error'}`, 'warn');
          break;
      }
      this.registerForm.enable();
      if (result === AuthResult.WrongCredentials) {
        this.registerForm.reset();
      }
    });
  }

  setDiet(diet: MatChipSelectionChange, dietName: string) {
    switch (dietName) {
      case 'vegetarian':
        this.registerForm.patchValue({vegetarian: diet.selected});
        break;
      case 'vegan':
        this.registerForm.patchValue({vegan: diet.selected});
        break;
      case 'glutenFree':
        this.registerForm.patchValue({glutenFree: diet.selected});
        break;
      case 'dairyFree':
        this.registerForm.patchValue({dairyFree: diet.selected});
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
