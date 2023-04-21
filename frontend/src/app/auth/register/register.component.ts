import {Component} from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthResult} from "../auth-result";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  registerForm = new FormGroup({
    username: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
    password: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
    displayName: new FormControl<string>('', {validators: [Validators.required], nonNullable: true}),
  });

  onSubmit(): void {
    const {username, password, displayName} = this.registerForm.value;
    this.registerForm.disable();

    this.authService.register({
      username: username ?? '',
      password: password ?? '',
      displayName: displayName ?? ''
    }).subscribe(result => {
      switch (result) {
        case AuthResult.Ok:
          console.log('Login successful.')
          this.router.navigate(['']);
          return;
        case AuthResult.WrongCredentials:
          // Username is already taken
          console.error('Username is already taken.');
          // TODO: Display error message
          break;
        case AuthResult.ServerError:
        case AuthResult.NetworkError:
          console.error(`Could not register: ${result === AuthResult.NetworkError ? 'network error' : 'server error'}`);
          // TODO: Display error message
          break;
      }
      this.registerForm.enable();
      if (result === AuthResult.WrongCredentials) {
        this.registerForm.reset();
      }
    });
  }

}
