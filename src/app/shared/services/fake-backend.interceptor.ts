import {HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {Injectable, Provider} from '@angular/core';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';
import {AuthResponse, CloseTicketResponse, CreateTicketResponse, DeleteTicketResponse, Ticket, User} from '../interfaces';

class InMemoryData {
  private static users: User[] = [
    {
      login: 'user1',
      password: '123123',
      isAdmin: false
    },
    {
      login: 'user2',
      password: '123123',
      isAdmin: false
    },
    {
      login: 'admin',
      password: '123123',
      isAdmin: true
    }
  ];

  private static tickets: Ticket[] = [
    {
      id: 1,
      title: 'Check this app',
      assignee: 'admin',
      reporter: 'user1',
      description: '<p>Hello world!</p><p><b>test</b></p>',
      isClosed: false
    },
    {
      id: 2,
      title: 'Problem user from USA',
      assignee: 'user1',
      reporter: 'admin',
      description: '<p>Problem with local ethernet!</p><p><b>=(</b></p>',
      isClosed: true
    },
    {
      id: 3,
      title: 'Test ticket 1',
      assignee: 'user2',
      reporter: 'admin',
      description: '<p>Problem with local ethernet!</p><p><b>=(</b></p>',
      isClosed: false
    },
    {
      id: 4,
      title: 'Test ticket 2',
      assignee: 'admin',
      reporter: 'user2',
      description: '<p>I\'m Cat!</p><p><b>mrr</b></p>',
      isClosed: true
    }
  ];

  public static getUsers(): User[] {
    return this.users;
  }

  public static getTickets(): Ticket[] {
    return this.tickets;
  }

  public static getTicket(id: number): Ticket {
    return this.tickets.find((ticket: Ticket) => {
      return ticket.id === id;
    });
  }

  public static isAdmin(login: string): boolean {
    const reqUser: User = this.users.find((user: User) => {
      return user.login === login;
    });

    return reqUser.isAdmin;
  }

  public static isCorrectCredentials(login: string, password: string): boolean {
    return !!this.getUsers().filter((user: User) => {
      return user.login === login && user.password === password;
    }).length;
  }
}

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
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.endsWith('/ticket') && method === 'GET':
          return getTicket(params);
        case url.endsWith('/ticket') && method === 'POST':
          return createTicket(params, body);
        case url.endsWith('/ticket') && method === 'PUT':
          return closeTicket(body);
        case url.endsWith('/ticket') && method === 'DELETE':
          return deleteTicket(params);
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    // route functions

    function authenticate(): Observable<HttpResponse<AuthResponse>> {
      const { login, password } = body;
      const isCorrectCredentials = InMemoryData.isCorrectCredentials(login, password);

      if (!isCorrectCredentials) {
        return error('Username or password is incorrect');
      }

      return ok<AuthResponse>({
        tokenId: 'fake-jwt-token',
        userId: login,
        isAdmin: InMemoryData.isAdmin(login)
      });
    }

    function getUsers(): Observable<HttpResponse<User[]>> {
      return ok<User[]>(InMemoryData.getUsers());
    }

    function getTickets(reqParams: HttpParams): Observable<HttpResponse<Ticket[]>> {
      const user: string = reqParams.get('userId').toString();
      const resTickets = InMemoryData.getTickets().filter((ticket: Ticket) => {
        return ticket.assignee === user || ticket.reporter === user;
      });

      if (!resTickets.length) {
        return ok<Ticket[]>([]);
      }

      return ok<Ticket[]>(resTickets);
    }

    function getTicket(reqParams: HttpParams): Observable<HttpResponse<Ticket>> {
      const ticketId = Number(reqParams.get('ticketId'));
      if (!ticketId) {
        return error('Ticket Id - required param');
      }

      return ok<Ticket>(InMemoryData.getTicket(ticketId));
    }

    function createTicket(reqParams: HttpParams, reqTicket: Ticket): Observable<HttpResponse<CreateTicketResponse>> {
      const userId = reqParams.get('userId');

      const isCorrectToken = reqParams.get('auth').toString() === 'fake-jwt-token';
      if (!isCorrectToken) {
        return unauthorized('Permission denied');
      }

      return ok<CreateTicketResponse>({
        userId,
        ticketId: 'fake-ticket-id',
        newTicket: reqTicket
      });
    }

    function closeTicket(bodyResponse): Observable<HttpResponse<CloseTicketResponse>> {
      return ok<CloseTicketResponse>({
        ticketId: bodyResponse.ticketId,
        isActionClose: bodyResponse.isActionClose,
        userId: bodyResponse.userId
      });
    }

    function deleteTicket(reqParams: HttpParams): Observable<HttpResponse<DeleteTicketResponse>> {
      const login = reqParams.get('userId');

      if (!InMemoryData.isAdmin(login)) {
        return unauthorized('Permission denied. You aren\'t admin');
      }
      return ok<DeleteTicketResponse>({
        ticketId: reqParams.get('ticketId'),
        userId: login
      });
    }

    // helper functions

    function ok<T>(bodyResponse?: T): Observable<HttpResponse<T>> {
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
