import {Injectable, Provider} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {AuthService} from './auth.service';
import {Router} from '@angular/router';
import {catchError} from 'rxjs/operators';

@Injectable()
class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.isAuthenticated()) {
      req = req.clone({
        setParams: {
          auth: this.auth.token
        }
      });
    }
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.log('Interceptor error', error);
          if (error.status === 401) {
            this.auth.logout();
            this.router.navigate(['/', 'login'], {
              queryParams: {
                authFailed: true
              }
            });
          }
          return throwError(error);
        })
      );
  }
}

export const AUTH_INTERCEPTOR: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true
};
