import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this._check(state.url);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this._check(state.url);
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
        return this._check('/');
    }

    private _check(redirectURL: string): Observable<boolean | UrlTree> {
        // Verifica si el usuario está autenticado
        if (this._authService.authenticated) {
            return of(true); // Permite el acceso
        } else {
            // Si no está autenticado, redirige al login con la URL de redirección
            return of(this._router.createUrlTree(['/sign-in'], { queryParams: { redirectURL } }));
        }
    }
}