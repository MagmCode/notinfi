/**
 * intervencion.module.ts
 * Módulo principal para las funcionalidades de intervención.
 * Importa y declara todos los componentes, módulos y servicios necesarios para las operaciones de intervención.
 * Configura Angular Material, adaptadores de fecha y formatos personalizados.
 * Inspirado en la estructura y comentarios de sustituciones-pendientes.component.ts.
*/

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IntervencionRoutingModule } from './intervencion.routing';
import { SharedModule } from 'app/shared/shared.module';
import { UserModule } from 'app/layout/common/user/user.module';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Angular Material
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule, MatNativeDateModule } from '@angular/material/core';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatChipsModule, MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar/loading-bar.module';
import { MatTreeModule } from '@angular/material/tree';
import { MatCardModule } from '@angular/material/card';

// Configuración de formatos y adaptador de fecha para Angular Material Datepicker
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateAdapter } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_DATE_FORMATS } from 'app/models/dateFormat';
import { LOCALE_ID } from '@angular/core';


// Componentes de intervención
import { CambioClaveIntervencionComponent } from './cambio-clave-intervencion/cambio-clave-intervencion.component';
import { AnulacionIntervencionComponent } from './anulacion-intervencion/anulacion-intervencion.component';
import { CargaIntervencionComponent } from './carga-intervencion/carga-intervencion.component';
import { ConsultabcvIntervencionComponent } from './consultabcv-intervencion/consultabcv-intervencion.component';
import { InterbancarioIntervencionComponent } from './interbancario-intervencion/interbancario-intervencion.component';
import { JornadaIntervencionComponent } from './jornada-intervencion/jornada-intervencion.component';
import { OperacionesIntervencionComponent } from './operaciones-intervencion/operaciones-intervencion.component';
import { EditOperacionesIntervencionModalComponent } from './operaciones-intervencion/edit-operaciones-intervencion-modal/edit-operaciones-intervencion-modal.component';
import { SustitucionesPendientesComponent } from './sustituciones-pendientes/sustituciones-pendientes.component';
import { SustitucionOperacionesComponent } from './sustitucion-operaciones/sustitucion-operaciones.component';
import { ConsultaDefinitivaBcvComponent } from './consulta-definitiva-bcv/consulta-definitiva-bcv.component';

@NgModule({
  declarations: [
    // Componentes principales de intervención
    CambioClaveIntervencionComponent,
    AnulacionIntervencionComponent,
    CargaIntervencionComponent,
    ConsultabcvIntervencionComponent,
    InterbancarioIntervencionComponent,
    JornadaIntervencionComponent,
    OperacionesIntervencionComponent,
    EditOperacionesIntervencionModalComponent,
    SustitucionesPendientesComponent,
    SustitucionOperacionesComponent,
    ConsultaDefinitivaBcvComponent
  ],
  imports: [
    // CommonModule,
    IntervencionRoutingModule,
    SharedModule,
    UserModule,
    // FormsModule,
    // ReactiveFormsModule,
    // Módulos de Angular Material y terceros
    // MatButtonModule,
    // MatButtonToggleModule,
    // MatFormFieldModule,
    // MatIconModule,
    // MatInputModule,
    // MatMenuModule,
    // MatSnackBarModule,
    // MatSelectModule,
    // NgxMatSelectSearchModule,
    // MatSidenavModule,
    // MatSortModule,
    // MatTableModule,
    // MatTabsModule,
    // ToastrModule.forRoot(),
    // NgxSpinnerModule,
    // MatDividerModule,
    // MatProgressBarModule,
    // MatRippleModule,
    // TranslocoModule,
    // NgApexchartsModule,
    // MatRadioModule,
    // MatCheckboxModule,
    // MatPaginatorModule,
    // MatSlideToggleModule,
    // MatTooltipModule,
    // MatDialogModule,
    // ScrollingModule,
    // MatChipsModule,
    // MatAutocompleteModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatMomentDateModule,
    // FuseLoadingBarModule,
    // MatTreeModule,
    // MatCardModule
  ]
  // providers: [
  //   // Configuración regional y de formato para el datepicker de Angular Material
  //   { provide: MAT_DATE_LOCALE, useValue: 'es-VE' }, // Localización de fechas (Venezuela)
  //   { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }, // Adaptador Moment.js
  //   { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, // Formato personalizado DD/MM/YYYY
  //    { provide: LOCALE_ID, useValue: 'es' }
  // ],
  // schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntervencionModule { }