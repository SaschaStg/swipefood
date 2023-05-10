import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {AuthResult} from "../auth-result";

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
        case AuthResult.Ok:
          console.log('Login successful.')
          this.router.navigate(['']);
          return;
        case AuthResult.WrongCredentials:
          console.error('Login credentials were wrong.');
          // TODO: Display error message
          break;
        case AuthResult.ServerError:
        case AuthResult.NetworkError:
          console.error(`Could not log in: ${result === AuthResult.NetworkError ? 'network error' : 'server error'}`);
          // TODO: Display error message
          break;
      }
      this.loginForm.enable();
      if (result === AuthResult.WrongCredentials) {
        this.loginForm.reset();
      }
    });
  }
}
