import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const token = authService.getToken();

    const authReq = token
        ? req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                return authService.refreshToken().pipe(
                    switchMap(() => {
                        const newToken = authService.getToken();
                        const retryReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`
                            }
                        });
                        return next(retryReq);
                    }),
                    catchError(err => {
                        authService.logout();
                        return throwError(() => err);
                    })
                );
            }
            return throwError(() => error);
        })
    );
};
