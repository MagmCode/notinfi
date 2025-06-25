import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-control-procesos',
  templateUrl: './control-procesos.component.html',
  styleUrls: ['./control-procesos.component.scss']
})
export class ControlProcesosComponent implements OnInit {

    /** Formulario reactivo para los criterios de búsqueda */
    procesosForm: FormGroup;

  today: Date = new Date();
  canViewTab: boolean = false;
  selectedTabIndex = 0;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
     this.procesosForm = this._formBuilder.group({
          fechaDesde: [this.today, Validators.required],
          fechaHasta: [this.today, Validators.required],
     });
  }

    /**
     * Maneja el cambio de pestaña, limpiando filtros y resultados si se regresa a la búsqueda.
     * @param event Evento de cambio de pestaña.
     */
    onTabChange(event: any): void {
      if (event.index === 0) {
        // this.dataSourceH = new MatTableDataSource([]);
        // this.intervencion = [];
        // this.cantidad = '';
        // this.total = '';
        // this.jornada = [];
      }
      if (event.index === 1) {
        // this.dataSourceH.paginator = this.paginator;
        // this.dataSourceH.sort = this.sortH;
      }
    }

  inicio(): void {
    this._router.navigate(['/menu-principal/'])
  }

  consultar(): void {
    this.selectedTabIndex = 1;
    this.canViewTab = true;
  }
}
