import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
 
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
       imports: [MatFormFieldModule, MatIconModule, ReactiveFormsModule, FormsModule, RouterModule, MatInputModule, BrowserAnimationsModule],
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
 });
