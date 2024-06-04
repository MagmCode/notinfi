import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';
import { CrearComponent } from './modules/admin/dashboards/solicitudes/crear/crear.component';
import { RequerimientoEquipoAsignacionComponent } from './modules/admin/dashboards/solicitudes/crear/requerimiento-equipo-asignacion/requerimiento-equipo-asignacion.component';
import { BuzonPendienteComponent } from './modules/admin/dashboards/inventario/buzon-pendiente/buzon-pendiente.component';
import { AsignarSolicitudComponent } from './modules/admin/dashboards/inventario/buzon-pendiente/asignar-solicitud/asignar-solicitud.component';
import { DetalleSolicitudComponent } from './modules/admin/dashboards/solicitudes/detalle-solicitud/detalle-solicitud.component';
import { DecisionSolicitudComponent } from './modules/admin/dashboards/solicitudes/decision-solicitud/decision-solicitud.component';
import { BuzonAsignadaComponent } from './modules/admin/dashboards/buzon/buzon-asignada/buzon-asignada.component';

import { BuzonPendienteSopComponent } from './modules/admin/dashboards/soporte/buzon-pendiente-sop/buzon-pendiente-sop.component';
import { AsignarSolicitudSopComponent } from './modules/admin/dashboards/soporte/buzon-pendiente-sop/asignar-solicitud-sop/asignar-solicitud-sop.component';
import { DetalleSolicitdComponent } from './modules/admin/dashboards/buzon/detalle-solicitd/detalle-solicitd.component';
import { ReasignarSolicitudinvComponent } from './modules/admin/dashboards/inventario/reasignar-solicitudinv/reasignar-solicitudinv.component';
import { ReasignarSolicitudsopComponent } from './modules/admin/dashboards/soporte/reasignar-solicitudsop/reasignar-solicitudsop.component';
import { MedicionesComponent } from './modules/admin/dashboards/mediciones/mediciones.component';
import { ReportesComponent } from './modules/admin/dashboards/mediciones/reportes/reportes.component';
import { CaciComponent } from './modules/admin/dashboards/caci/caci.component';
import { DetalleSolProveeduriaComponent } from './modules/admin/dashboards/solicitudes/detalle-sol-proveeduria/detalle-sol-proveeduria.component';
import { DecisionSolProveeduriaComponent } from './modules/admin/dashboards/solicitudes/decision-sol-proveeduria/decision-sol-proveeduria.component';
import { InventarioProveeduriaComponent } from './modules/admin/dashboards/inventario-proveeduria/inventario-proveeduria.component';
import { AsignarSolProveeduriaComponent } from './modules/admin/dashboards/inventario-proveeduria/asignar-sol-proveeduria/asignar-sol-proveeduria.component';
import { ReasignarSolProveeduriaComponent } from './modules/admin/dashboards/inventario-proveeduria/reasignar-sol-proveeduria/reasignar-sol-proveeduria.component';



// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/dashboards/project'
    {path: '', pathMatch : 'full', redirectTo: 'dashboards/project'},

    // Redirect signed in user to the '/dashboards/project'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'solicitudes/gestionarSolicitudes'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
        ]
    },

    // Landing routes
    {
        path: 'home',
        component  : LayoutComponent,
        data: {
            layout: 'empty'
        },
        children   : [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule)},
        ]
    },

    // Admin routes
    {
        path       : '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component  : LayoutComponent,
        resolve    : {
            initialData: InitialDataResolver,
        },
        children   : [
            
            {path: 'solicitudes', children: [
                {path: 'gestionarSolicitudes', loadChildren: () => import('app/modules/admin/dashboards/solicitudes/solicitudes.module').then(m => m.ProjectModule)},
                {path: 'crear',  component: CrearComponent},
                {path: 'asignacion', component: RequerimientoEquipoAsignacionComponent},
                {path: 'detalleSolicitud', component: DetalleSolicitudComponent}, 
                {path: 'decisionSolicitud', component: DecisionSolicitudComponent},
                {path: 'detalleSolProveeduria', component:DetalleSolProveeduriaComponent},
                {path: 'decisionSolProveeduria', component: DecisionSolProveeduriaComponent},
               
                
            ]},            

            {path: 'inventario', children: [
                {path: 'buzonPendiente',  component: BuzonPendienteComponent},
                {path: 'asignarSolicitud',  component: AsignarSolicitudComponent},
                {path: 'reasignarSolicitud',  component: ReasignarSolicitudinvComponent}
            ]},
            
            {path: 'soporte', children: [
                {path: 'buzonPendiente',  component: BuzonPendienteSopComponent},
                {path: 'asignarSolicitud',  component: AsignarSolicitudSopComponent},
                {path: 'reasignarSolicitud',  component: ReasignarSolicitudsopComponent}
            ]},
            

            {path: 'buzon', children: [
                {path: 'buzonAsignadas',  component: BuzonAsignadaComponent},
                {path: 'detalleSolicitud',  component: DetalleSolicitdComponent},
                
            ]},
            
            {path: 'mediciones', children: [
                {path: 'indicadores',  component: MedicionesComponent},
                {path: 'reportes',  component: ReportesComponent},
                
            ]},

            

            {path: 'caci', children: [
                {path: 'consultacaci',  component: CaciComponent},
                
            ]},

            
            {path: 'inventario-proveeduria', children: [
                {path: 'buzonPendiente',  component: InventarioProveeduriaComponent},
                {path: 'asignarSolicitud',  component: AsignarSolProveeduriaComponent},
                {path: 'reasignarSolicitud',  component: ReasignarSolProveeduriaComponent}
            ]},
            
            // Pages
            {path: 'pages', children: [                
                // Error
                {path: 'error', children: [
                    {path: '404', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
                    {path: '500', loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.module').then(m => m.Error500Module)}
                ]}
                          
            ]},

            // 404 & Catch all
            {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module)},
            {path: '**', redirectTo: '404-not-found'}
        ]
    }
];
