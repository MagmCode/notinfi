// Importación de módulos y componentes para el sistema de rutas de Angular
import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { MenuPrincipalComponent } from './modules/menu-principal/menu-principal.component';
import { CargaMesaCambioComponent } from './modules/mesaDeCambio/carga/carga.component';
import { OperacionesMesaCambioComponent } from './modules/mesaDeCambio/operaciones/operaciones.component';
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

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * Configuración principal de rutas de la aplicación.
 * Se utilizan regiones para identificar las secciones principales.
 */
export const appRoutes: Route[] = [

    //#region Redirecciones principales
    // Redirige la ruta vacía al inicio de sesión
    { path: '', pathMatch: 'full', redirectTo: 'sign-in' },

    // Redirige a los usuarios autenticados al menú principal después de iniciar sesión
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'menu-principal' },
    //#endregion

    //#region Rutas de autenticación para invitados (usuarios no autenticados)
    {
        path: '',
        canActivate: [NoAuthGuard], // Solo accesible si NO está autenticado
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: { layout: 'empty' },
        children: [
            // Ruta para iniciar sesión
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule) },
            // Ruta para registrarse
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule) }
        ]
    },
    //#endregion

    //#region Rutas de autenticación para usuarios autenticados
    {
        path: '',
        canActivate: [AuthGuard], // Solo accesible si está autenticado
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: { layout: 'empty' },
        children: [
            // Ruta para cerrar sesión
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule) },
            // Ruta para desbloquear sesión
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule) }
        ]
    },
    //#endregion

    //#region Ruta de landing (página de inicio)
    {
        path: 'home',
        component: LayoutComponent,
        data: { layout: 'empty' },
        children: [
            // Página principal de bienvenida
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.module').then(m => m.LandingHomeModule) },
        ]
    },
    //#endregion

    //#region Rutas principales de la aplicación (menú, módulos, etc.)
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: { layout: 'classy' },
        children: [
            // Menú principal
            {
                path: 'menu-principal', children: [
                    { path: '', component: MenuPrincipalComponent },
                ]
            },
            // Mesa de Cambio
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
            // Intervención (Lazy loading)
            {
                path: 'intervencion',
                loadChildren: () => import('./modules/intervencion/intervencion.module').then(m => m.IntervencionModule)
            },
            // Menudeo
            {
                path: 'menudeo', children: [
                    { path: 'carga', component: CargaMenudeoComponent },
                    { path: 'operaciones', component: OperacionesMenudeoComponent },
                    { path: 'consulta-tasasBCV', component: ConsultaTasasbcvMenudeoComponent },
                    { path: 'cambio_clave', component: CambioClaveMenudeoComponent },
                    { path: 'demanda', component: DemandaMenudeoComponent },
                    { path: 'consultaBCV', component: ConsultabcvMenudeoComponent },
                    { path: 'lectura-de-archivo', component: LecturaArchivoMenudeoComponent },
                    { path: 'consulta-conciliacion', component: ConsultaConciliacionMenudeoComponent },
                ]
            },
            // Intención de Retiro (Lazy loading)
            {
                path: 'retiro',
                loadChildren: () => import('./modules/intencion-retiro/intencion-retiro.module').then(m => m.IntencionRetiroModule)
            },
            // Intención de Venta (Lazy loading)
            {
                path: 'venta',
                loadChildren: () => import('./modules/intencion-venta/intencion-venta.module').then(m => m.IntencionVentaModule)
            },
        ]
    },
    //#endregion

    //#region Rutas de páginas generales y manejo de errores
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: { layout: 'empty' },
        children: [
            // Páginas generales
            {
                path: 'pages', children: [
                    // Páginas de error
                    {
                        path: 'error', children: [
                            { path: '404', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module) },
                            { path: '500', loadChildren: () => import('app/modules/admin/pages/error/error-500/error-500.module').then(m => m.Error500Module) }
                        ]
                    }
                ]
            },
            // Página 404 personalizada
            { path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/admin/pages/error/error-404/error-404.module').then(m => m.Error404Module) },
            // Ruta comodín para redirigir cualquier ruta no encontrada a la página 404
            { path: '**', redirectTo: '404-not-found' }
        ]
    }
    //#endregion
];