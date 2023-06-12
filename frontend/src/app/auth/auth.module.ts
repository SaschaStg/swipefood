import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AuthRoutingModule} from './auth-routing.module';
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    // External modules
    CommonModule,
    ReactiveFormsModule,
    // Routing module
    AuthRoutingModule,
    // Material modules
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  providers: []
})
export class AuthModule {
}
