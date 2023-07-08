import {TestBed} from "@angular/core/testing";
import {AuthService} from "./auth.service";
import {authGuard} from "./auth.guards";
import {UrlTree} from "@angular/router";

describe('authGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: jasmine.createSpyObj('AuthService', ['isLoggedIn']),
        },
      ]
    });

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  it('should return true', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);

    const result = TestBed.runInInjectionContext(authGuard);

    expect(authServiceSpy.isLoggedIn.calls.count())
      .withContext('spy method was called once')
      .toBe(1);

    expect(result)
      .toBe(true);
  });

  it('should redirect to login page', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);

    const result = TestBed.runInInjectionContext(authGuard);

    expect(authServiceSpy.isLoggedIn.calls.count())
      .withContext('spy method was called once')
      .toBe(1);

    expect(result instanceof UrlTree)
      .withContext('guard returned UrlTree')
      .toBe(true);

    expect(result.toString())
      .toBe('/home');
  });
})
