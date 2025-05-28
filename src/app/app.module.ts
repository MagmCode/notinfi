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
import {ScrollingModule} from '@angular/cdk/scrolling';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import {MAT_CHIPS_DEFAULT_OPTIONS, MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ReasignarSolicitudinvComponent } from './modules/admin/dashboards/inventario/reasignar-solicitudinv/reasignar-solicitudinv.component';
import { ModalReasignarComponent } from './modules/admin/dashboards/inventario/modal-reasignar/modal-reasignar.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MenuPrincipalComponent } from './modules/menu-principal/menu-principal.component';
import { UserModule } from "./layout/common/user/user.module";
import { MainLayoutsComponent } from './modules/main-layouts/main-layouts.component';
import { CargaMesaCambioComponent } from './modules/mesaDeCambio/carga/carga.component';
import { OperacionesMesaCambioComponent } from './modules/mesaDeCambio/operaciones/operaciones.component';
// import { OperacionesIntervencionComponent } from './modules/intervencion/operaciones-intervencion/operaciones-intervencion.component';
// import { CargaIntervencionComponent } from './modules/intervencion/carga-intervencion/carga-intervencion.component';
// import { InterbancarioIntervencionComponent } from './modules/intervencion/interbancario-intervencion/interbancario-intervencion.component';
// import { CambioClaveIntervencionComponent } from './modules/intervencion/cambio-clave-intervencion/cambio-clave-intervencion.component';
// import { AnulacionIntervencionComponent } from './modules/intervencion/anulacion-intervencion/anulacion-intervencion.component';
// import { ConsultabcvIntervencionComponent } from './modules/intervencion/consultabcv-intervencion/consultabcv-intervencion.component';
import { ConsultabcvMenudeoComponent } from './modules/menudeo/consultabcv-menudeo/consultabcv-menudeo.component';
import { OperacionesMenudeoComponent } from './modules/menudeo/operaciones-menudeo/operaciones-menudeo.component';
import { DemandaMenudeoComponent } from './modules/menudeo/demanda-menudeo/demanda-menudeo.component';
import { CargaMenudeoComponent } from './modules/menudeo/carga-menudeo/carga-menudeo.component';
import { ConsultaTasasbcvMenudeoComponent } from './modules/menudeo/consulta-tasasbcv-menudeo/consulta-tasasbcv-menudeo.component';
import { LecturaArchivoMenudeoComponent } from './modules/menudeo/lectura-archivo-menudeo/lectura-archivo-menudeo.component';
import { ConsultaConciliacionMenudeoComponent } from './modules/menudeo/consulta-conciliacion-menudeo/consulta-conciliacion-menudeo.component';
import { CambioClaveMenudeoComponent } from './modules/menudeo/cambio-clave-menudeo/cambio-clave-menudeo.component';
import { ConsultabcvMesaCambioComponent } from './modules/mesaDeCambio/consultabcv-mesa-cambio/consultabcv-mesa-cambio.component';
import { AnulacionMasivaMesaCambioComponent } from './modules/mesaDeCambio/anulacion-masiva-mesa-cambio/anulacion-masiva-mesa-cambio.component';
import { CambioClaveMesaCambioComponent } from './modules/mesaDeCambio/cambio-clave-mesa-cambio/cambio-clave-mesa-cambio.component';
import { InterbancarioMesaCambioComponent } from './modules/mesaDeCambio/interbancario-mesa-cambio/interbancario-mesa-cambio.component';
import { DemandaMesaCambioComponent } from './modules/mesaDeCambio/demanda-mesa-cambio/demanda-mesa-cambio.component';
import { ConsultaIntercambioMesaCambioComponent } from './modules/mesaDeCambio/consulta-intercambio-mesa-cambio/consulta-intercambio-mesa-cambio.component';
import { OfertaMesaCambioComponent } from './modules/mesaDeCambio/oferta-mesa-cambio/oferta-mesa-cambio.component';
// import { EditOperacionesIntervencionModalComponent } from './modules/intervencion/operaciones-intervencion/edit-operaciones-intervencion-modal/edit-operaciones-intervencion-modal.component';
import { FuseLoadingBarModule } from "../@fuse/components/loading-bar/loading-bar.module";
// import { JornadaIntervencionComponent } from './modules/intervencion/jornada-intervencion/jornada-intervencion.component';
import { HttpClientModule } from '@angular/common/http';
import { MatTreeModule } from '@angular/material/tree';
// import { IntencionRetiroComponent } from './modules/intencion-retiro/intencion-retiro.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_DATE_FORMATS } from 'app/models/dateFormat';
// import { IntencionVentaComponent } from './modules/intencion-venta/intencion-venta.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from './shared/mat-paginator-intl';
import { IntervencionModule } from './modules/intervencion/intervencion.module';
import { IntencionRetiroModule } from './modules/intencion-retiro/intencion-retiro.module';
import { IntencionVentaModule } from './modules/intencion-venta/intencion-venta.module';


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
        ReasignarSolicitudinvComponent,
        ModalReasignarComponent,
        MenuPrincipalComponent,
        MainLayoutsComponent,
        CargaMesaCambioComponent,
        OperacionesMesaCambioComponent,
        // OperacionesIntervencionComponent,
        // CargaIntervencionComponent,
        // InterbancarioIntervencionComponent,
        // CambioClaveIntervencionComponent,
        // AnulacionIntervencionComponent,
        // ConsultabcvIntervencionComponent,
        ConsultabcvMenudeoComponent,
        OperacionesMenudeoComponent,
        DemandaMenudeoComponent,
        CargaMenudeoComponent,
        ConsultaTasasbcvMenudeoComponent,
        LecturaArchivoMenudeoComponent,
        ConsultaConciliacionMenudeoComponent,
        CambioClaveMenudeoComponent,
        ConsultabcvMesaCambioComponent,
        AnulacionMasivaMesaCambioComponent,
        CambioClaveMesaCambioComponent,
        InterbancarioMesaCambioComponent,
        DemandaMesaCambioComponent,
        ConsultaIntercambioMesaCambioComponent,
        OfertaMesaCambioComponent,
        // EditOperacionesIntervencionModalComponent,
        // JornadaIntervencionComponent,
        // IntencionRetiroComponent,
        // IntencionVentaComponent,

        

        
    ],
    imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
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
    MatSnackBarModule,
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
    MatMomentDateModule,
    UserModule,
    FuseLoadingBarModule,
    MatTreeModule,
    IntervencionModule,
    IntencionRetiroModule,
    IntencionVentaModule
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
          },
          { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
          { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
       ],
})
export class AppModule
{
}
