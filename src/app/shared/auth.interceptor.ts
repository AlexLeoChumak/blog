import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError, tap } from 'rxjs';
import { AuthService } from '../admin/shared/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.authService.isAuthenticated()) {
      req = req.clone({
        setParams: {
          auth: this.authService.token,
        },
      });
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Interceptor error: ', error);
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/admin', 'login'], {
            queryParams: {
              authFailed: true,
            },
          });
        }

        return throwError(() => error);
      })
    );
  }
}
