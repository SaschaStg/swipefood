 import {ComponentFixture, TestBed} from '@angular/core/testing';
 import {LoginComponent} from './login.component';
 import {AuthService} from "../auth.service";
 import {SnackBarService} from "../../services/snackbar.service";
 import {MatFormFieldModule} from "@angular/material/form-field";
 import {MatIconModule} from "@angular/material/icon";
 import {FormsModule, ReactiveFormsModule} from "@angular/forms";
 import {ActivatedRoute} from "@angular/router";
 import {MatInputModule} from "@angular/material/input";
 import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { By } from '@angular/platform-browser';
import {RouterTestingModule} from "@angular/router/testing";
import { SwipeComponent } from 'src/app/swipe/swipe.component';

 describe('LoginComponent', () => {
   let component: LoginComponent;
   let fixture: ComponentFixture<LoginComponent>;
 
   const authServiceMockData = {
     isLoggedIn: false,
     user: {name: 'Max Mustermann'}
   }
   const snackServiceMockData = {};
 
   beforeEach(async () => {
     await TestBed.configureTestingModule({
       declarations: [LoginComponent],
       imports: [MatFormFieldModule, MatIconModule, ReactiveFormsModule, FormsModule, 
        RouterTestingModule.withRoutes( 
          [{path: 'login', component: LoginComponent},
          { path:' ' , component: SwipeComponent}]), 
        MatInputModule, BrowserAnimationsModule],
       providers: [
         {provide: AuthService, useValue: authServiceMockData},
         {provide: ActivatedRoute, useValue: {snapshot: {queryParams: {returnUrl: '/'}}}},
         {provide: SnackBarService,
           useValue: snackServiceMockData
         }]
     })
       .compileComponents();
 
     fixture = TestBed.createComponent(LoginComponent);
     component = fixture.componentInstance;
     fixture.detectChanges();
   });
 
   it('should create', () => {
     expect(component).toBeTruthy();
   });

   it('should show a login button', () => {
    expect(getLoginButton()).toBeTruthy();
  });

  it('should log in', () => {
    expect(authServiceMockData.user.name).toBe('Max Mustermann');
  });



   function getLoginButton(): HTMLButtonElement {
    return fixture.debugElement.query(By.css('button')).nativeElement;
  }   
  it('component initial state', function () {
    expect(component.loginForm.valid).toBeFalsy();
    expect(component.loginForm.controls['username'].valid).toBeFalsy();
    expect(component.loginForm.controls['password'].valid).toBeFalsy();
    expect(component.loginForm.invalid).toBeTruthy();
  });

  it('should create the form', function () {
    const username = fixture.debugElement.nativeElement.querySelector('#username');
  });

  it('username field validity', () => {
    const username = component.loginForm.controls['username'];
    expect(username.valid).toBeFalsy();

    username.setValue('');
    expect(username.hasError('required')).toBeTruthy();

    username.setValue('test');
    expect(username.hasError('required')).toBeFalsy();
  });

  it('password field validity', () => {
    const password = component.loginForm.controls['password'];
    expect(password.valid).toBeFalsy();

    password.setValue('');
    expect(password.hasError('required')).toBeTruthy();

    password.setValue('test');
    expect(password.hasError('required')).toBeFalsy();
  });

  it('route to home after submitting', () => {
    expect(component.loginForm.valid).toBeFalsy();
    component.loginForm.controls['username'].setValue('Max Mustermann');
    component.loginForm.controls['password'].setValue('VerySecurePassword');
    expect(component.loginForm.valid).toBeTruthy();
    fixture.detectChanges();
    const button = fixture.debugElement.query(By.css('.login-btn-container')).nativeElement;
    button.click();
    fixture.detectChanges();
   expect(location.pathname).toBe('/context.html');
  }); 
 });
