import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {User} from '../interfaces';
import {catchError} from 'rxjs/operators';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class UsersService {
  public error$: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient
  ) { }

  public getAll(): Observable<User[]> {
    return this.http.get<User[]>(`/users`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
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
