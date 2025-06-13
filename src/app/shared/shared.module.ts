import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ExportProgressComponent } from './export-progress.component';



@NgModule({
    declarations: [
        ExportProgressComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressBarModule
    ],
    exports: [
        ExportProgressComponent,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatProgressBarModule
    ]
})
export class SharedModule
{
}
