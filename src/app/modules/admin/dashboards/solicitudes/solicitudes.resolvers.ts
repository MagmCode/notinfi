import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { SolicitudesService } from './solicitudes.service';

@Injectable({
    providedIn: 'root'
})
export class SolicitudesResolver implements Resolve<any>
{
    /**
     * Constructor
     */
    constructor(private _solicitudesService: SolicitudesService)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param route
     * @param state
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any>
    {
        return this._solicitudesService.getData();
    }
}
