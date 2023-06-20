import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {AuthResult} from "../auth-result";
import {SnackBarService} from "../../services/snackbar.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackBarService,
  ) {
  }

  loginForm = new FormGroup({
    username: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
    password: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
  });

  onSubmit(): void {
    const {username, password} = this.loginForm.value;
    this.loginForm.disable();

    this.authService.login(username ?? '', password ?? '').subscribe(result => {
      switch (result) {
        case AuthResult.Ok:
          console.log('Login successful.')
          this.router.navigate(['']);
          return;
        case AuthResult.WrongCredentials:
          this.snackBarService.openSnackBar('Wrong username or password.')
          break;
        case AuthResult.ServerError:
        case AuthResult.NetworkError:
          this.snackBarService.openSnackBar(`Could not log in: ${result === AuthResult.NetworkError ? 'network error' : 'server error'}`);
          break;
      }
      this.loginForm.enable();
      if (result === AuthResult.WrongCredentials) {
        this.loginForm.reset();
      }
    });
  }

}
