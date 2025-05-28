import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IntervencionRoutingModule } from './intervencion.routing';
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
import { SharedModule } from 'app/shared/shared.module';
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
import { UserModule } from 'app/layout/common/user/user.module';
import { FuseLoadingBarModule } from '@fuse/components/loading-bar/loading-bar.module';
import { MatTreeModule } from '@angular/material/tree';
import { MatCardModule } from '@angular/material/card';


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
    CommonModule,
    IntervencionRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatCardModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class IntervencionModule { }