import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {CreateResponse, Ticket} from '../interfaces';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class TicketsService {
  public error$: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public getTicket(ticketId: string): Observable<any> {
    return this.http.get('/ticket', {params: {ticketId}});
  }

  public getAll(userId: string): Observable<Ticket[]> {
    if (!userId) {
      this.router.navigate(['/', 'login']);
      return throwError('UserId isn\'t found');
    }

    const reqParams = new HttpParams().set('userId', userId);
    return this.http.get<Ticket[]>(`/tickets`, {params: reqParams})
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  public create(ticket: Ticket): Observable<any> {
    return this.http.post('/ticket', ticket)
      .pipe(map((response: CreateResponse) => {
         return {
           ...ticket,
           id: response.ticketId
         };
        },
        catchError(this.handleError.bind(this)))
      );
  }

  public delete(ticketId: string): Observable<{ ticketId: string }> {
    return this.http.delete<{ ticketId: string }>('/ticket', {
      params: {
        ticketId,
        userId: localStorage.getItem('user-id')
      }
    });
  }

  public close(ticketId: string, isActionClose: boolean): Observable<{ ticketId: string }> {
    const body = { ticketId, isActionClose, userId: localStorage.getItem('user-id') };
    return this.http.put<{ ticketId: string }>('/ticket', body);
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    const {message} = error.error;

    switch (message) {
      case 'Permission denied':
        this.error$.next('Permission denied');
        break;
      case 'Too Many Requests':
        this.error$.next('Too Many Requests');
        break;
      default:
        this.error$.next('Server error, please try again later');
        break;
    }

    return throwError(error);
  }
}
