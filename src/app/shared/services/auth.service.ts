import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AuthResponse, User} from '../interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {tap} from 'rxjs/operators';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  public get token(): string {
    return localStorage.getItem('token');
  }

  public error$: Subject<string> = new Subject<string>();

  private static setToken(response: AuthResponse | null): void {
    if (response) {
      localStorage.clear();
      localStorage.setItem('token', response.tokenId);
      localStorage.setItem('user-id', response.userId);
      localStorage.setItem('is-admin', response.isAdmin.toString());
    } else {
      localStorage.clear();
    }
  }

  public login(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/login', user)
      .pipe(
        tap(AuthService.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  public logout(): void {
    AuthService.setToken(null);
  }

  public isAuthenticated(): boolean {
    return !!this.token;
  }

  public isAdmin(): boolean {
    return localStorage.getItem('is-admin') === 'true';
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    const {message} = error.error;

    switch (message) {
      case 'Username or password is incorrect':
        this.error$.next('Username or password is incorrect');
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
