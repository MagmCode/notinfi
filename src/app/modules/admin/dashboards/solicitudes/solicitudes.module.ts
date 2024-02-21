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
import { MatSelectModule } from '@angular/material/select';
import { RequerimientoEquipoAsignacionComponent } from './crear/requerimiento-equipo-asignacion/requerimiento-equipo-asignacion.component';
import {MatRadioModule} from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatosAsignadoComponent } from './crear/datos-asignado/datos-asignado.component';
import {MatDialogModule} from '@angular/material/dialog';
import { ModaldecisionesComponent } from './modaldecisiones/modaldecisiones.component';


@NgModule({
    declarations: [
        SolicitudesComponent,
        CrearComponent,
        RequerimientoEquipoAsignacionComponent,
        DatosAsignadoComponent,
        ModaldecisionesComponent
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
    
    ],
})
export class ProjectModule
{
}
