import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
    /**
     * Constructor
     */
    constructor(private _authService: AuthService)
    {
    }

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        // Obtener el token desde localStorage
        const token = localStorage.getItem('token');

        // Si hay token, agregarlo a la cabecera Authorization
        let newReq = req;
        if (token) {
            newReq = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + token)
                // headers: req.headers.set('Authorization', token) //Descomentar cuando se actualice el back
            });
        }

        // Response
        return next.handle(newReq).pipe(
            catchError((error) => {
                // Catch "401 Unauthorized" and "403 Forbidden" responses
                if (
                    error instanceof HttpErrorResponse &&
                    (error.status === 401 || error.status === 403)
                ) {
                    // Limpia el token y cualquier otro dato de sesión
                    localStorage.clear();
                    sessionStorage.clear();
                    // Log para depuración de redirección
                    console.log('Interceptor: Redirigiendo a', window.location.origin + '/#/sign-in', 'desde', window.location.href);
                    // Elimina cualquier query param antes de redirigir
                    if (window.location.hash !== '#/sign-in') {
                        window.location.hash = '#/sign-in';
                    } else {
                        window.location.replace(window.location.origin + '/#/sign-in');
                    }
                    return throwError(() => error);
                }
                return throwError(() => error);
            })
        );
    }
}
