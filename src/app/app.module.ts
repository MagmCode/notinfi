import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ExtraOptions, PreloadAllModules, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { FuseModule } from '@fuse';
import { FuseConfigModule } from '@fuse/services/config';
import { FuseMockApiModule } from '@fuse/lib/mock-api';
import { CoreModule } from 'app/core/core.module';
import { appConfig } from 'app/core/config/app.config';
import { mockApiServices } from 'app/mock-api';
import { LayoutModule } from 'app/layout/layout.module';
import { AppComponent } from 'app/app.component';
import { appRoutes } from 'app/app.routing';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER, MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from "ngx-spinner";
import { SpinnerComponent } from './modules/admin/spinner/spinner.component';
import { InventarioComponent } from './modules/admin/dashboards/inventario/inventario.component';
import { BuzonPendienteComponent } from './modules/admin/dashboards/inventario/buzon-pendiente/buzon-pendiente.component';

import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';

import { MatRadioModule} from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {  MatTooltipModule } from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import { AsignarSolicitudComponent } from './modules/admin/dashboards/inventario/buzon-pendiente/asignar-solicitud/asignar-solicitud.component';
import { BuzonComponent } from './modules/admin/dashboards/buzon/buzon.component';
import { BuzonAsignadaComponent } from './modules/admin/dashboards/buzon/buzon-asignada/buzon-asignada.component';

import { ModalIngresarEquipoComponent } from './modules/admin/dashboards/buzon/modal-ingresar-equipo/modal-ingresar-equipo.component'; 
import {ScrollingModule} from '@angular/cdk/scrolling';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import {MAT_CHIPS_DEFAULT_OPTIONS, MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { SoporteComponent } from './modules/admin/dashboards/soporte/soporte.component';
import { BuzonPendienteSopComponent } from './modules/admin/dashboards/soporte/buzon-pendiente-sop/buzon-pendiente-sop.component';
import { AsignarSolicitudSopComponent } from './modules/admin/dashboards/soporte/buzon-pendiente-sop/asignar-solicitud-sop/asignar-solicitud-sop.component';

import { DetalleSolicitdComponent } from './modules/admin/dashboards/buzon/detalle-solicitd/detalle-solicitd.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReasignarSolicitudinvComponent } from './modules/admin/dashboards/inventario/reasignar-solicitudinv/reasignar-solicitudinv.component';
import { ReasignarSolicitudsopComponent } from './modules/admin/dashboards/soporte/reasignar-solicitudsop/reasignar-solicitudsop.component';
import { ModalReasignarComponent } from './modules/admin/dashboards/inventario/modal-reasignar/modal-reasignar.component';
import { ModalDesicionSopComponent } from './modules/admin/dashboards/buzon/modal-desicion-sop/modal-desicion-sop.component';
import { MedicionesComponent } from './modules/admin/dashboards/mediciones/mediciones.component';
import { ReportesComponent } from './modules/admin/dashboards/mediciones/reportes/reportes.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { CaciComponent } from './modules/admin/dashboards/caci/caci.component';
import { InventarioProveeduriaComponent } from './modules/admin/dashboards/inventario-proveeduria/inventario-proveeduria.component';
import { AsignarSolProveeduriaComponent } from './modules/admin/dashboards/inventario-proveeduria/asignar-sol-proveeduria/asignar-sol-proveeduria.component';
import { ReasignarSolProveeduriaComponent } from './modules/admin/dashboards/inventario-proveeduria/reasignar-sol-proveeduria/reasignar-sol-proveeduria.component';
import { AdministracionComponent } from './modules/admin/dashboards/proveeduria/administracion/administracion.component';
import { EditarComponent } from './modules/admin/dashboards/proveeduria/administracion/editar/editar.component';
import { DespachoProveeduriaComponent } from './modules/admin/dashboards/despacho-proveeduria/despacho-proveeduria.component';
import { AsignarSolProveeduriaDESComponent } from './modules/admin/dashboards/despacho-proveeduria/asignar-sol-proveeduria-des/asignar-sol-proveeduria-des.component';
import { ReasignarSolProveeduriaDESComponent } from './modules/admin/dashboards/despacho-proveeduria/reasignar-sol-proveeduria-des/reasignar-sol-proveeduria-des.component';
import { DetalleSolicitudProveduriaComponent } from './modules/admin/dashboards/buzon/detalle-solicitud-proveduria/detalle-solicitud-proveduria.component';
import { ReportesGeneralesComponent } from './modules/admin/dashboards/reportes-generales/reportes-generales.component';
import { CrearComponent } from './modules/admin/dashboards/proveeduria/administracion/crear/crear.component';
import { NivelAtencionComponent } from './modules/admin/dashboards/caci/nivel-atencion/nivel-atencion.component';
import { AsignarSolCaciComponent } from './modules/admin/dashboards/caci/nivel-atencion/asignar-sol-caci/asignar-sol-caci.component';
import { ReasignarSolCaciComponent } from './modules/admin/dashboards/caci/nivel-atencion/reasignar-sol-caci/reasignar-sol-caci.component';
import { AtencionSolicitudComponent } from './modules/admin/dashboards/atencion-solicitud/atencion-solicitud.component';
import { ReasignarSolicitudSgComponent } from './modules/admin/dashboards/atencion-solicitud/reasignar-solicitud-sg/reasignar-solicitud-sg.component';
import { AsignarSolicitudSgComponent } from './modules/admin/dashboards/atencion-solicitud/asignar-solicitud-sg/asignar-solicitud-sg.component';
import { AprobacionSolInternaComponent } from './modules/admin/dashboards/atencion-solicitud/aprobacion-sol-interna/aprobacion-sol-interna.component';
import { DetalleSolicitudServgeneralesComponent } from './modules/admin/dashboards/buzon/detalle-solicitud-servgenerales/detalle-solicitud-servgenerales.component';
import { ReasignarSolicitudSgAiComponent } from './modules/admin/dashboards/atencion-solicitud/aprobacion-sol-interna/reasignar-solicitud-sg-ai/reasignar-solicitud-sg-ai.component';
import { AdministracionServgeneralesComponent } from './modules/admin/dashboards/atencion-solicitud/administracion-servgenerales/administracion-servgenerales.component';
import { CrearModificarComponent } from './modules/admin/dashboards/atencion-solicitud/administracion-servgenerales/crear-modificar/crear-modificar.component';


const routerConfig: ExtraOptions = {
    preloadingStrategy       : PreloadAllModules,
    scrollPositionRestoration: 'enabled',
    useHash :true
};

@NgModule({
    declarations: [
        AppComponent,
        SpinnerComponent,
        InventarioComponent,
        BuzonPendienteComponent,
        AsignarSolicitudComponent,
        BuzonComponent,
        BuzonAsignadaComponent,
        DetalleSolicitdComponent,
        ModalIngresarEquipoComponent,
        SoporteComponent,
        BuzonPendienteSopComponent,
        AsignarSolicitudSopComponent,
        ReasignarSolicitudinvComponent,
        ReasignarSolicitudsopComponent,
        ModalReasignarComponent,
        ModalDesicionSopComponent,
        MedicionesComponent,
        ReportesComponent,
        InventarioProveeduriaComponent,
        AsignarSolProveeduriaComponent,
        ReasignarSolProveeduriaComponent,
        CaciComponent,
        AdministracionComponent,
        EditarComponent,
        DespachoProveeduriaComponent,
        AsignarSolProveeduriaDESComponent,
        ReasignarSolProveeduriaDESComponent,
        DetalleSolicitudProveduriaComponent,
        ReportesGeneralesComponent,
        CrearComponent,
        NivelAtencionComponent,
        AsignarSolCaciComponent,
        ReasignarSolCaciComponent,
        AtencionSolicitudComponent,
        ReasignarSolicitudSgComponent,
        AsignarSolicitudSgComponent,
        AprobacionSolInternaComponent,
        DetalleSolicitudServgeneralesComponent,
        ReasignarSolicitudSgAiComponent,
        AdministracionServgeneralesComponent,
        CrearModificarComponent,
        
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        // Fuse, FuseConfig & FuseMockAPI
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core module of your application
        CoreModule,

        // Layout module of your application
        LayoutModule,
        // 3rd party modules that require global configuration via forRoot
        MarkdownModule.forRoot({}),
          MatButtonModule,
          MatButtonToggleModule,
          MatFormFieldModule,
          MatIconModule,
          MatInputModule,
          MatMenuModule,
          MatSelectModule,
          NgxMatSelectSearchModule,
          MatSidenavModule,
          MatSortModule,
          MatTableModule,
          MatTabsModule,
          ToastrModule.forRoot(),
          NgxSpinnerModule,
          MatDividerModule,
          MatProgressBarModule,
          MatRippleModule,
          TranslocoModule,
          NgApexchartsModule,
          SharedModule,
          MatRadioModule,
          MatCheckboxModule,
          MatPaginatorModule,
          MatSlideToggleModule,
          MatTooltipModule,
          MatDialogModule,
          ScrollingModule,
          MatChipsModule,
          MatAutocompleteModule,
          MatDatepickerModule,
          MatNativeDateModule,
          MatMomentDateModule

    ],
    exports: [NgxSpinnerModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    
    entryComponents:[
        SpinnerComponent
      ],
    bootstrap   : [
        AppComponent
    ],
    providers: [
        {
         provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
         useValue: MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
        }, {
            provide: MAT_CHIPS_DEFAULT_OPTIONS,
            useValue: {
              separatorKeyCodes: [ENTER, COMMA]
            }
          }
       ],
})
export class AppModule
{
}
