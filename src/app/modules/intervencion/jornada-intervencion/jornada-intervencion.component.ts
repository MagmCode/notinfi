// #region Imports
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { jornadaActiva } from 'app/models/intervencion';
import { ServiceService } from 'app/services/service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
// #endregion

/**
 * Componente para la consulta de jornadas de intervención.
 * Muestra una tabla con los datos de la jornada y permite filtrar y ordenar.
 */
@Component({
  selector: 'jornada-intervencion',
  templateUrl: './jornada-intervencion.component.html',
  styleUrls: ['./jornada-intervencion.component.scss'],
})
export class JornadaIntervencionComponent implements OnInit, AfterViewInit {

  //#region Variables

  /** Indica si la información está cargando */
  isLoading: boolean = false;

  /** Columnas a mostrar en la tabla de jornadas */
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

  /** Fuente de datos para la tabla de jornadas */
  dataSourceH: MatTableDataSource<jornadaActiva> = new MatTableDataSource([]);

  /** Referencia al componente de ordenamiento de Angular Material */
  @ViewChild(MatSort) sortH: MatSort = new MatSort();

  /** Referencia al paginador de Angular Material */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //#endregion

  /**
   * Constructor del componente.
   * @param _router Servicio de rutas de Angular.
   * @param _service Servicio para obtener datos de intervención.
   * @param _snackBar Servicio para mostrar notificaciones.
   */
  constructor(
    private _router: Router,
    private _service: ServiceService,
    private _snackBar: MatSnackBar
  ) {}

  //#region Métodos principales

  /**
   * Inicializa el componente y carga los datos de la jornada.
   * Si no hay datos precargados, consulta al backend y guarda en cache local.
   */
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

  /**
   * Asigna el paginador y el ordenamiento a la tabla después de que la vista se inicializa.
   */
  ngAfterViewInit(): void {
    this.dataSourceH.paginator = this.paginator;
    this.dataSourceH.sort = this.sortH;
  }

  //#endregion

  //#region funciones privadas

  /**
   * Asigna los datos a la tabla y configura el ordenamiento personalizado.
   * @param jornada Lista de jornadas activas.
   */
  private setDataSource(jornada: jornadaActiva[]): void {
    this.dataSourceH = new MatTableDataSource(jornada);
    this.dataSourceH.sortingDataAccessor = this.getSortingDataAccessor();
    this.dataSourceH.paginator = this.paginator;
    this.dataSourceH.sort = this.sortH;
  }

  /**
   * Intenta cargar los datos desde cache local y muestra un mensaje.
   * Si no hay cache, deja la tabla vacía.
   * @param localKey Clave de cache en localStorage.
   * @param message Mensaje a mostrar en el snackBar.
   */
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

  /**
   * Devuelve una función para acceder a los datos de las columnas personalizadas al ordenar.
   */
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

  /**
   * Aplica un filtro a la tabla de jornadas.
   * @param event Evento de entrada del filtro.
   */
  applyFilterH(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceH.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceH.paginator) {
      this.dataSourceH.paginator.firstPage();
    }
  }

  /**
   * Calcula la semana del mes para una fecha dada en formato dd/mm/yyyy o yyyy-mm-dd.
   * @param dateString Fecha en formato string.
   * @returns Número de semana del mes (1-5) o NaN si la fecha es inválida.
   */
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

  /**
   * Navega al menú principal de la aplicación.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/']);
  }
  //#endregion
}