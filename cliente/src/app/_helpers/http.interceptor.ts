import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const USER_KEY = 'auth-user';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.clearSession();
        }
        return throwError(() => error);
      }),
    );
  }
  private getToken(): string | null {
    try {
      const raw = window.localStorage.getItem(USER_KEY);
      if (!raw) return null;

      const stored = JSON.parse(raw);
      return stored?.data?.token ?? stored?.token ?? stored?.usuario?.token ?? null;
    } catch {
      return null;
    }
  }
  private clearSession(): void {
    window.localStorage.clear();
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
  }
}
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
