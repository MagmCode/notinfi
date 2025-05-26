import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class NoAuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(
        private _authService: AuthService,
        private _router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this._check();
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
        return this._check();
    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> {
        return this._check();
    }

    private _check(): Observable<boolean> {
        // Verifica si el usuario está autenticado
        if (this._authService.authenticated) {
            // Si está autenticado, redirige a la página principal
            this._router.navigate(['/menu-principal']);
            return of(false); // Impide el acceso
        } else {
            // Si no está autenticado, permite el acceso
            return of(true);
        }
    }
}