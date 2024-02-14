import { Route } from '@angular/router';
import { SolicitudesComponent } from './solicitudes.component'; 
import { SolicitudesResolver } from './solicitudes.resolvers';

export const solicitudesRoutes: Route[] = [
    {
        path     : '',
        component: SolicitudesComponent,
        resolve  : {
            data: SolicitudesResolver
        }
    }
];
