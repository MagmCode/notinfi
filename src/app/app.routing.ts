import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
// import { MainLayoutsComponent } from './modules/main-layouts/main-layouts.component';
import { MenuPrincipalComponent } from './modules/menu-principal/menu-principal.component';
import { CargaMesaCambioComponent } from './modules/mesaDeCambio/carga/carga.component';
import { OperacionesMesaCambioComponent } from './modules/mesaDeCambio/operaciones/operaciones.component';
import { OperacionesIntervencionComponent } from './modules/intervencion/operaciones-intervencion/operaciones-intervencion.component';
import { CargaIntervencionComponent } from './modules/intervencion/carga-intervencion/carga-intervencion.component';
import { InterbancarioIntervencionComponent } from './modules/intervencion/interbancario-intervencion/interbancario-intervencion.component';
import { CambioClaveIntervencionComponent } from './modules/intervencion/cambio-clave-intervencion/cambio-clave-intervencion.component';
import { AnulacionIntervencionComponent } from './modules/intervencion/anulacion-intervencion/anulacion-intervencion.component';
import { ConsultabcvIntervencionComponent } from './modules/intervencion/consultabcv-intervencion/consultabcv-intervencion.component';
import { CargaMenudeoComponent } from './modules/menudeo/carga-menudeo/carga-menudeo.component';
import { OperacionesMenudeoComponent } from './modules/menudeo/operaciones-menudeo/operaciones-menudeo.component';
import { ConsultaTasasbcvMenudeoComponent } from './modules/menudeo/consulta-tasasbcv-menudeo/consulta-tasasbcv-menudeo.component';
import { CambioClaveMenudeoComponent } from './modules/menudeo/cambio-clave-menudeo/cambio-clave-menudeo.component';
import { DemandaMenudeoComponent } from './modules/menudeo/demanda-menudeo/demanda-menudeo.component';
import { ConsultabcvMenudeoComponent } from './modules/menudeo/consultabcv-menudeo/consultabcv-menudeo.component';
import { LecturaArchivoMenudeoComponent } from './modules/menudeo/lectura-archivo-menudeo/lectura-archivo-menudeo.component';
import { ConsultaConciliacionMenudeoComponent } from './modules/menudeo/consulta-conciliacion-menudeo/consulta-conciliacion-menudeo.component';
import { ConsultabcvMesaCambioComponent } from './modules/mesaDeCambio/consultabcv-mesa-cambio/consultabcv-mesa-cambio.component';
import { AnulacionMasivaMesaCambioComponent } from './modules/mesaDeCambio/anulacion-masiva-mesa-cambio/anulacion-masiva-mesa-cambio.component';
import { CambioClaveMesaCambioComponent } from './modules/mesaDeCambio/cambio-clave-mesa-cambio/cambio-clave-mesa-cambio.component';
import { InterbancarioMesaCambioComponent } from './modules/mesaDeCambio/interbancario-mesa-cambio/interbancario-mesa-cambio.component';
import { DemandaMesaCambioComponent } from './modules/mesaDeCambio/demanda-mesa-cambio/demanda-mesa-cambio.component';
import { ConsultaIntercambioMesaCambioComponent } from './modules/mesaDeCambio/consulta-intercambio-mesa-cambio/consulta-intercambio-mesa-cambio.component';
import { OfertaMesaCambioComponent } from './modules/mesaDeCambio/oferta-mesa-cambio/oferta-mesa-cambio.component';
import { JornadaIntervencionComponent } from './modules/intervencion/jornada-intervencion/jornada-intervencion.component';
import { IntencionVentaComponent } from './modules/intencion-venta/intencion-venta.component';




// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/sign-in'
    {path: '', pathMatch : 'full', redirectTo: 'sign-in'},

    // Redirect signed in user to the '/dashboards/project'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'menu-principal'},



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
        component: LayoutComponent,
        data: {
            layout: 'classy'
        },
        children   : [


            // {path: 'solicitudes', children: [
            //     { path: 'gestionarSolicitudes', loadChildren: () => import('app/modules/admin/dashboards/solicitudes/solicitudes.module').then(m => m.ProjectModule) },
            //   ]
            // },
            
            {
              path: 'menu-principal', children: [
                { path: '', component: MenuPrincipalComponent },
              ]
            },
            {
                path: 'mesa-de-cambio', children: [
                  { path: 'carga', component: CargaMesaCambioComponent },
                  { path: 'operaciones', component: OperacionesMesaCambioComponent },
                  { path: 'consultaBCV', component: ConsultabcvMesaCambioComponent },
                  { path: 'anulacion-masiva', component: AnulacionMasivaMesaCambioComponent },
                  { path: 'cambio-de-clave', component: CambioClaveMesaCambioComponent },
                  { path: 'interbancario', component: InterbancarioMesaCambioComponent },
                  { path: 'demanda', component: DemandaMesaCambioComponent },
                  { path: 'consulta-intercambio', component: ConsultaIntercambioMesaCambioComponent },
                  { path: 'oferta', component: OfertaMesaCambioComponent },
                ]
            },

            {
                path: 'intervencion', // <-- Esta es la ruta base
                loadChildren: () => import('./modules/intervencion/intervencion.module').then(m => m.IntervencionModule)
            },
            {

              path: 'menudeo', children: [
                { path: 'carga', component: CargaMenudeoComponent }, //tiene la misma ruta de lectura de archivo
                { path: 'operaciones', component: OperacionesMenudeoComponent}, //tiene la misma ruta de demanda
                { path: 'consulta-tasasBCV', component: ConsultaTasasbcvMenudeoComponent},
                { path: 'cambio_clave', component: CambioClaveMenudeoComponent},
                { path: 'demanda', component: DemandaMenudeoComponent},
                { path: 'consultaBCV', component: ConsultabcvMenudeoComponent},
                { path: 'lectura-de-archivo', component: LecturaArchivoMenudeoComponent},
                { path: 'consulta-conciliacion', component: ConsultaConciliacionMenudeoComponent},
              ]
            },

            {
                path: 'retiro', 
                    loadChildren: () => import('./modules/intencion-retiro/intencion-retiro.module').then(m => m.IntencionRetiroModule)
            },
            {
                path: 'venta',
                loadChildren: () => import('./modules/intencion-venta/intencion-venta.module').then(m => m.IntencionVentaModule)
            },
            
            // {path: 'solicitudes', children: [
            //     {path: 'gestionarSolicitudes', loadChildren: () => import('app/modules/admin/dashboards/solicitudes/solicitudes.module').then(m => m.ProjectModule)},
                              
                
            // ]},            

            // {path: 'inventario', children: [
            //     {path: 'layout',  component: LayoutComponent},
            //     {path: 'vertical', component: ClassyLayoutComponent}
               
            // ]},
        ]
    },
            
    {
            path       : '',
            canActivate: [NoAuthGuard],
            canActivateChild: [NoAuthGuard],
            component: LayoutComponent,
            data: {
                layout: 'empty'
            },
            children   : [

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
