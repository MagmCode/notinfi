import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ExportProgressService } from 'app/services/export-progress.service'; // Ajusta la ruta si es necesario


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
    public exportProgressService: ExportProgressService 

  ) { }

  ngOnInit(): void {
    this.procesosForm = this._formBuilder.group({
      fechaDesde: [this.today, Validators.required],
      fechaHasta: [this.today, Validators.required],
      nroCedRif: [''],
      enProceso: [false]
    });

    // Datos de prueba
    this.dataSourceProcesos.data = [
      { id: 1, transaccion: 'TX01', fechaInicio: '2024-06-01', fechaFin: '2024-06-02', error: '', usuario: 'admin', accion: '' }
    ];
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
    this.selectedTabIndex = 1;
    this.canViewTab = true;
  }
}