import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-export-progress',
  template: `
      <div *ngIf="showExportProgress" class="text-center mb-2 text-sm text-gray-700" style="margin-top: -60px;">
      <ng-container *ngIf="!generandoArchivo; else preparandoDescarga">
        Generando archivo: {{exportProgress}}%
      </ng-container>
      <ng-template #preparandoDescarga>
        {{mensajePreparandoDescarga}}
      </ng-template>
    </div>
    <div *ngIf="showExportStart" class="text-center text-sm text-gray-700 progress" style="margin-top: -60px;">
      <ng-container>{{mensajeConexionActual}}</ng-container>
    </div>
    <mat-progress-bar
      *ngIf="showExportProgress"
      mode="determinate"
      [value]="exportProgress">
    </mat-progress-bar>
    <mat-progress-bar
      *ngIf="showExportStart && !showExportProgress"
      mode="indeterminate">
    </mat-progress-bar>
  `
})
export class ExportProgressComponent {
  @Input() showExportProgress: boolean;
  @Input() exportProgress: number;
  @Input() generandoArchivo: boolean;
  @Input() mensajePreparandoDescarga: string;
  @Input() showExportStart: boolean;
  @Input() mensajeConexionActual: string;
}