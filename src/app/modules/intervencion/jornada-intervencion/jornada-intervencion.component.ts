// #region Imports
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { intervencion, jornadaActiva, respuestaIntervencion } from 'app/models/intervencion';
import { ServiceService } from 'app/services/service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
// #endregion


@Component({
  selector: 'jornada-intervencion',
  templateUrl: './jornada-intervencion.component.html',
  styleUrls: ['./jornada-intervencion.component.scss'],
})
export class JornadaIntervencionComponent implements OnInit, AfterViewInit {

  //#region Variables
  selectedTabIndex = 0;
  isLoading: boolean = false;

  // Variables relacionadas con la tabla
  displayedColumns: string[] = [
    'tipoIntervencion',
    'coVentaBCV',
    'fechaInicio',
    'fechaFin',
    'fechaValor',
    'tipoCambio',
    'coMonedaIso',
    'saldoDisponible',
    'semana'
  ];
  dataSourceH: MatTableDataSource<jornadaActiva> = new MatTableDataSource([]);
  @ViewChild(MatSort) sortH: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // #region Constructor
  constructor(
    private _router: Router,
    private _service: ServiceService,
    private _snackBar: MatSnackBar
  ) {}
  // #endregion

  // #region Métodos principales
  ngOnInit(): void {
    this.isLoading = true;
    const LOCAL_KEY = 'jornadaActivaCache';
    this._service.jornadaActiva$.subscribe({
      next: (jornada) => {
        if (jornada.length === 0) {
          // Si no hay datos precargados, realiza la consulta al backend
          this._service.consultaJornadaActiva().subscribe({
            next: (jornada) => {
              localStorage.setItem(LOCAL_KEY, JSON.stringify(jornada));
              this.setDataSource(jornada);
              this.isLoading = false;
            },
            error: () => {
              this.loadFromCacheOrEmpty(LOCAL_KEY, 'No se ha podido actualizar la jornada.');
              this.isLoading = false;
            }
          });
        } else {
          // Usa los datos precargados
          localStorage.setItem(LOCAL_KEY, JSON.stringify(jornada));
          this.setDataSource(jornada);
          this.isLoading = false;
        }
      },
      error: () => {
        this.loadFromCacheOrEmpty(LOCAL_KEY, 'No se ha podido actualizar la jornada. Mostrando datos previos.');
        this.isLoading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceH.paginator = this.paginator;
    this.dataSourceH.sort = this.sortH;
  }

  private setDataSource(jornada: jornadaActiva[]): void {
    this.dataSourceH = new MatTableDataSource(jornada);
    this.dataSourceH.sortingDataAccessor = this.getSortingDataAccessor();
    this.dataSourceH.paginator = this.paginator;
    this.dataSourceH.sort = this.sortH;
  }

  private loadFromCacheOrEmpty(localKey: string, message: string): void {
    const cache = localStorage.getItem(localKey);
    if (cache) {
      const jornadaCache = JSON.parse(cache);
      this.setDataSource(jornadaCache);
      this._snackBar.open(message, 'Cerrar', { duration: 6000, horizontalPosition: 'right' });
    } else {
      this.dataSourceH = new MatTableDataSource([]);
    }
  }

  private getSortingDataAccessor() {
    return (item: jornadaActiva, property: string) => {
      if (property === 'tipoIntervencion') {
        return item.tipoIntervencion?.nombreTipoIntervencion || '';
      }
      if (property === 'coMonedaIso') {
        return item.codigoIsoDivisa?.coMonedaIso || '';
      }
      if (property === 'tipoCambio') {
        return item.tipoCambioIntervencion && item.tipoCambioIntervencion[0]?.tipoCambio != null
          ? item.tipoCambioIntervencion[0].tipoCambio
          : '';
      }
      if (property === 'fechaValor') {
        return item.tipoCambioIntervencion && item.tipoCambioIntervencion[0]?.fechaValor
          ? item.tipoCambioIntervencion[0].fechaValor
          : '';
      }
      return item[property];
    };
  }

  applyFilterH(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceH.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceH.paginator) {
      this.dataSourceH.paginator.firstPage();
    }
  }

  getWeekOfMonth(dateString: string): number {
    if (!dateString) {
      console.error('Fecha no válida:', dateString);
      return NaN;
    }
    const parts = dateString.split('/');
    if (parts.length === 3) {
      dateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Fecha no válida después de convertir:', dateString);
      return NaN;
    }
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    const startDayOfWeek = startOfMonth.getDay();
    return Math.ceil((dayOfMonth + startDayOfWeek) / 7);
  }

  menuPrincipal(): void {
    this._router.navigate(['/menu-principal/']);
  }
}