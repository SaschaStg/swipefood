import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {LoginResult} from "../login-result";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
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
        case LoginResult.Ok:
          console.log('Login successful.')
          this.router.navigate(['']);
          return;
        case LoginResult.WrongCredentials:
          console.error('Login credentials were wrong.');
          // TODO: Display error message
          break;
        case LoginResult.ServerError:
        case LoginResult.NetworkError:
          console.error(`Could not log in: ${result === LoginResult.NetworkError ? 'network error' : 'server error'}`);
          // TODO: Display error message
          break;
      }
      this.loginForm.enable();
      if (result === LoginResult.WrongCredentials) {
        this.loginForm.reset();
      }
    });
  }
}
