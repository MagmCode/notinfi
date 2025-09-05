
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExportProgressComponent } from './export-progress.component';

// Angular Material y terceros

// Angular Material y terceros
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

@NgModule({
        declarations: [
                ExportProgressComponent
        ],
        imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                MatProgressBarModule,
                MatSnackBarModule,
                MatButtonModule,
                MatButtonToggleModule,
                MatInputModule,
                MatFormFieldModule,
                MatIconModule,
                MatTableModule,
                MatPaginatorModule,
                MatSortModule,
                MatMenuModule,
                MatSelectModule,
                NgxMatSelectSearchModule,
                MatSidenavModule,
                MatTabsModule,
                ToastrModule.forRoot(),
                NgxSpinnerModule,
                MatDividerModule,
                MatRippleModule,
                TranslocoModule,
                NgApexchartsModule,
                MatRadioModule,
                MatCheckboxModule,
                MatSlideToggleModule,
                MatTooltipModule,
                MatDialogModule,
                ScrollingModule,
                MatChipsModule,
                MatAutocompleteModule,
                MatDatepickerModule,
                MatNativeDateModule,
                MatMomentDateModule,
                FuseLoadingBarModule,
                MatTreeModule,
                MatCardModule,
        ],
        exports: [
                ExportProgressComponent,
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                MatProgressBarModule,
                MatSnackBarModule,
                MatButtonModule,
                MatButtonToggleModule,
                MatInputModule,
                MatFormFieldModule,
                MatIconModule,
                MatTableModule,
                MatPaginatorModule,
                MatSortModule,
                MatMenuModule,
                MatSelectModule,
                NgxMatSelectSearchModule,
                MatSidenavModule,
                MatTabsModule,
                ToastrModule,
                NgxSpinnerModule,
                MatDividerModule,
                MatRippleModule,
                TranslocoModule,
                NgApexchartsModule,
                MatRadioModule,
                MatCheckboxModule,
                MatSlideToggleModule,
                MatTooltipModule,
                MatDialogModule,
                ScrollingModule,
                MatChipsModule,
                MatAutocompleteModule,
                MatDatepickerModule,
                MatNativeDateModule,
                MatMomentDateModule,
                FuseLoadingBarModule,
                MatTreeModule,
                MatCardModule
        ],
         providers: [
            // Configuración regional y de formato para el datepicker de Angular Material
            { provide: MAT_DATE_LOCALE, useValue: 'es-VE' }, // Localización de fechas (Venezuela)
            { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] }, // Adaptador Moment.js
            { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, // Formato personalizado DD/MM/YYYY
            { provide: LOCALE_ID, useValue: 'es' }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule {}
