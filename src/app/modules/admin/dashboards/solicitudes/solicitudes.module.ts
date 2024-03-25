import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { SolicitudesComponent } from './solicitudes.component';
import { solicitudesRoutes } from './solicitudes.routing';
import { CrearComponent } from './crear/crear.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER, MatSelectModule } from '@angular/material/select';
import { RequerimientoEquipoAsignacionComponent } from './crear/requerimiento-equipo-asignacion/requerimiento-equipo-asignacion.component';
import {MatRadioModule} from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER, MatTooltipModule } from '@angular/material/tooltip';
import { DatosAsignadoComponent } from './crear/datos-asignado/datos-asignado.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ModaldecisionesComponent } from './modaldecisiones/modaldecisiones.component';
import { DetalleSolicitudComponent } from './detalle-solicitud/detalle-solicitud.component';
import { DecisionSolicitudComponent } from './decision-solicitud/decision-solicitud.component';
import {MAT_CHIPS_DEFAULT_OPTIONS, MatChipsModule} from '@angular/material/chips';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { RequerimientoEquipoReposicionComponent } from './crear/requerimiento-equipo-reposicion/requerimiento-equipo-reposicion.component';
import { RequerimientoEquipoDesincorporacionComponent } from './crear/requerimiento-equipo-desincorporacion/requerimiento-equipo-desincorporacion.component';
import { DatosReposicionComponent } from './crear/datos-reposicion/datos-reposicion.component';
import { DatosDesincorporacionComponent } from './crear/datos-desincorporacion/datos-desincorporacion.component';


@NgModule({
    declarations: [
        SolicitudesComponent,
        CrearComponent,
        RequerimientoEquipoAsignacionComponent,
        DatosAsignadoComponent,
        ModaldecisionesComponent,
        DetalleSolicitudComponent,
        DecisionSolicitudComponent,
        RequerimientoEquipoReposicionComponent,
        RequerimientoEquipoDesincorporacionComponent,
        DatosReposicionComponent,
        DatosDesincorporacionComponent,
    ],
    imports     : [
        RouterModule.forChild(solicitudesRoutes),
        MatButtonModule,
        MatButtonToggleModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatRippleModule,
        MatSidenavModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        NgApexchartsModule,
        TranslocoModule,
        SharedModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatRadioModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatDialogModule,
        MatChipsModule,
        ScrollingModule,
        MatAutocompleteModule,
        NgxMatSelectSearchModule 
    
    ],
    providers: [
        {
         provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
         useValue: MAT_SELECT_SCROLL_STRATEGY_PROVIDER,
         
        },
        {
            provide: MAT_CHIPS_DEFAULT_OPTIONS,
            useValue: {
              separatorKeyCodes: [ENTER, COMMA]
            }
          }

       ],
})
export class ProjectModule
{
}
