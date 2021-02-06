import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthResponse, User} from '../interfaces';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  public get token(): string {
    return localStorage.getItem('token');
  }

  public login(user: User): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/login', user)
      .pipe(
        tap(this.setToken)
      );
  }

  public logout(): void {
    this.setToken(null);
  }

  public iaAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(response: AuthResponse | null): void {
    if (response) {
      localStorage.setItem('token', response.idToken);
      localStorage.setItem('user-id', response.idUser);
    } else {
      localStorage.clear();
    }
  }
}
