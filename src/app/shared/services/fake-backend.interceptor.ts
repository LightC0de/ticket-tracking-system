import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import { Provider} from '@angular/core';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';
import {AuthResponse} from '../interfaces';

class FakeBackendInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, body } = request;

    // wrap in delayed observable to simulate server api call
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute(): Observable<any> {
      switch (true) {
        case url.endsWith('/login') && method === 'POST':
          return authenticate();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate(): Observable<HttpResponse<AuthResponse>> {
      const { login, password } = body;
      const isCorrectCredentials = login === 'admin' && password === '123123';

      if (!isCorrectCredentials) {
        return error('Username or password is incorrect');
      }
      return ok({
        tokenId: 'fake-jwt-token',
        userId: 'danil'
      });
    }

    // helper functions

    function ok(bodyResponse?): Observable<HttpResponse<AuthResponse>> {
      return of(new HttpResponse({ status: 200, body: bodyResponse }));
    }

    function error(message): Observable<HttpResponse<AuthResponse>> {
      return throwError({ error: { message } });
    }
  }
}

export const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
