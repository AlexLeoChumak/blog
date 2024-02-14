import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { IFbAuthResponse, IUser } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {}

  get token(): string {
    const tokenExpiration = localStorage.getItem('fb-token-exp');
    const expDate = tokenExpiration ? new Date(tokenExpiration) : null;

    if (!expDate || new Date() > expDate) {
      this.logout();
      return '';
    }

    const token = localStorage.getItem('fb-token');
    return token ? token : '';
  }

  login(user: IUser): Observable<any> {
    user.returnSecureToken = true;

    return this.http
      .post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`,
        user
      )
      .pipe(
        tap((res: any) => {
          this.setToken(res);
        })
      );
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private setToken(res: IFbAuthResponse | null) {
    if (res) {
      const expDate = new Date(new Date().getTime() + +res.expiresIn * 1000);
      localStorage.setItem('fb-token', res.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
