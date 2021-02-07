import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {Injectable, Provider} from '@angular/core';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';
import {AuthResponse, CreateResponse, Ticket} from '../interfaces';

@Injectable()
class FakeBackendInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, params, body } = request;

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
        case url.endsWith('/tickets') && method === 'GET':
          return getTickets(params);
        case url.endsWith('/ticket') && method === 'POST':
          return createTicket(params);
        case url.endsWith('/ticket') && method === 'PUT':
          return closeTicket();
        case url.endsWith('/ticket') && method === 'DELETE':
          return deleteTicket();
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

    function getTickets(reqParams: HttpParams): Observable<HttpResponse<Ticket[]>> {
      const isCorrectUserId = reqParams.get('userId').toString() === 'danil';
      if (!isCorrectUserId) {
        return error('Incorrect user id');
      }

      return ok([
        {
          id: 1,
          title: 'Check this app',
          assignee: 'danil',
          reporter: 'Bob',
          description: '<p>Hello world!</p><p><b>test</b></p>'
        },
        {
          id: 2,
          title: 'Problem user from USA',
          assignee: 'Bob',
          reporter: 'danil',
          description: '<p>Problem with local ethernet!</p><p><b>=(</b></p>'
        },
        {
          id: 3,
          title: 'Test ticket 1',
          assignee: 'Bob',
          reporter: 'danil',
          description: '<p>Problem with local ethernet!</p><p><b>=(</b></p>'
        },
        {
          id: 4,
          title: 'Test ticket 2',
          assignee: 'danil',
          reporter: 'Cat',
          description: '<p>I\'m Cat!</p><p><b>mrr</b></p>'
        }
      ]);
    }

    function createTicket(reqParams: HttpParams): Observable<HttpResponse<CreateResponse>> {
      const isCorrectToken = reqParams.get('auth').toString() === 'fake-jwt-token';
      if (!isCorrectToken) {
        return unauthorized('Permission denied');
      }

      return ok({
        ticketId: 'fake-ticket-id'
      });
    }

    function closeTicket(): Observable<HttpResponse<any>> {
      return ok();
    }

    function deleteTicket(): Observable<HttpResponse<any>> {
      return ok();
    }

    // helper functions

    function ok(bodyResponse?): Observable<HttpResponse<any>> {
      return of(new HttpResponse({ status: 200, body: bodyResponse }));
    }

    function error(message): Observable<HttpResponse<any>> {
      return throwError({ error: { message } });
    }

    function unauthorized(message): Observable<HttpResponse<any>> {
      return throwError({ error: { message }, status: 401 });
    }
  }
}

export const FAKE_BACKEND_INTERCEPTOR: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true
};
