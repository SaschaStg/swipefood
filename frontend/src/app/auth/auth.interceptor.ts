import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
  ) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // only intercept api requests
    if (request.url.startsWith('api/')) {
      return next.handle(request).pipe(
        tap(event => {
          if (event.type === HttpEventType.Response && event.status === HttpStatusCode.Unauthorized) {
            // if the token is not recognized by the server, log the user out
            this.authService.logout();
          }
        }),
      );
    }
    return next.handle(request);
  }
}
