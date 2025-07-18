import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExportProgressService } from 'app/services/export-progress.service';
import { ServiceService } from 'app/services/service.service';



@Component({
  selector: 'app-control-procesos',
  templateUrl: './control-procesos.component.html',
  styleUrls: ['./control-procesos.component.scss']
})
export class ControlProcesosComponent implements OnInit, AfterViewInit {

  procesosForm: FormGroup;
  today: Date = new Date();
  canViewTab: boolean = false;
  selectedTabIndex = 0;

  displayedColumnsProcesos: string[] = [
    'id', 'transaccion', 'fechaInicio', 'fechaFin', 'error', 'usuario', 'accion'
  ];

  dataSourceProcesos = new MatTableDataSource<any>([]);

  @ViewChild('paginatorProcesos') paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    public exportProgressService: ExportProgressService,
    private serviceService: ServiceService 



  ) { }

  ngOnInit(): void {
    this.procesosForm = this._formBuilder.group({
      fechaDesde: [this.today, Validators.required],
      fechaHasta: [this.today, Validators.required],
      nroCedRif: [''],
      enProceso: [false]
    });
  }

  ngAfterViewInit() {
    this.dataSourceProcesos.paginator = this.paginator;
    this.dataSourceProcesos.sort = this.sort;
  }

  onTabChange(event: any): void {
    if (event.index === 0) {
      // Limpiar si es necesario
    }
    if (event.index === 1) {
      // Asignar paginador y sort si es necesario
      this.dataSourceProcesos.paginator = this.paginator;
      this.dataSourceProcesos.sort = this.sort;
    }
  }

  inicio(): void {
    this._router.navigate(['/menu-principal/'])
  }

  consultar(): void {
    const formValue = this.procesosForm.value;
    const payload = {
      fechaDesde: this.formatDate(formValue.fechaDesde),
      fechaHasta: this.formatDate(formValue.fechaHasta),
      enEjecucion: formValue.enProceso ? 1 : 0,
      userId: formValue.nroCedRif || ''
    };

    this.serviceService.consultaProcesos(payload).subscribe((res: any[]) => {
      // Adapta los datos para la tabla
      this.dataSourceProcesos.data = res.map(item => ({
        id: item.ejecucionId,
        transaccion: item.transaId,
        fechaInicio: item.fechaInicio,
        fechaFin: item.fechaFin,
        error: item.descError,
        usuario: item.userId,
        accion: ''
      }));
      this.selectedTabIndex = 1;
      this.canViewTab = true;
    });
  }

    private formatDate(date: Date): string {
    // Formatea la fecha a dd-MM-yyyy
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
}