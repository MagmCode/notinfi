// #region Imports
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { jornadaActiva, SustitucionesPendientes } from 'app/models/intervencion';
import { ServiceService } from 'app/services/service.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SustitucionPendiente } from 'app/models/sustituciones';
import { ExportProgressService } from 'app/services/export-progress.service';
// #endregion

/**
 * Componente para la consulta de jornadas de intervención.
 * Muestra una tabla con los datos de la jornada y permite filtrar y ordenar.
 */
@Component({
  selector: "sustituciones-pendientes",
  templateUrl: "./sustituciones-pendientes.component.html",
  styleUrls: ["./sustituciones-pendientes.component.scss"],
})
export class SustitucionesPendientesComponent implements OnInit, AfterViewInit {
  //#region Variables

  /** Indica si la información está cargando */
  isLoading: boolean = false;
  /** Código de la jornada seleccionada */
  selectedCodigo: string | null = null;
  /** Índice de la pestaña seleccionada */
  selectedTabIndex = 0;
  /** Controla la visibilidad de la pestaña de resultados */
  canViewTab: boolean = false;

  

  /** Columnas a mostrar en la tabla de jornadas */
  displayedColumns: string[] = [
    "seleccion",
    "tipoIntervencion",
    "coVentaBCV",
    "fechaInicio",
    "fechaFin",
    "fechaValor",
    "tipoCambio",
    "coMonedaIso",
    "saldoDisponible",
    "semana",
  ];

  displayedColumnsPendientes: string[] = [
    "coMovIntervencion",
    "codigoCliente",
    "nombreCliente",
    "fechaValor",
    "codigoTipoOperacion",
    "montoDivisa",
    "tipoCambio",
    "codigoCuentaDivisa",
    "codigoCuentaBs",
    "codigoIsoDivisa",
    "codigoVentaBCV",
  ];

  /** Fuente de datos para la tabla de jornadas */
  dataSourceH: MatTableDataSource<jornadaActiva> = new MatTableDataSource([]);

  // Fuente de datos para la tabla de pendientes
  dataSourcePendientes = new MatTableDataSource<SustitucionPendiente>([]);

  /** Referencia al componente de ordenamiento de Angular Material */
  @ViewChild('sortPendientes') sortPendientes: MatSort;

  /** Referencia al paginador de Angular Material */
  @ViewChild('paginatorPendientes') paginatorPendientes: MatPaginator;



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
    private _snackBar: MatSnackBar,
    private exportProgressService: ExportProgressService
  ) {}

  //#region Métodos principales

  /**
   * Inicializa el componente y carga los datos de la jornada.
   * Consulta al backend.
   */
  ngOnInit(): void {
    this.isLoading = true;
    const LOCAL_KEY = "sustitucionesPendientesCache";
    const LOCAL_KEY_PENDIENTES = "sustitucionesPendientesData";
  const pendientesCache = localStorage.getItem(LOCAL_KEY_PENDIENTES);
  if (pendientesCache) {
    this.dataSourcePendientes.data = JSON.parse(pendientesCache);
    this.canViewTab = true;
    this.selectedTabIndex = 1;
    this.isLoading = false;
  }
    this._service.sustitucionesPendientes$.subscribe({
      next: (jornadasSustitucion) => {
        if (jornadasSustitucion.length === 0) {
          // consulta al backend
          this._service.consultaSustitucionesPendientes().subscribe({
            next: (jornadasSustitucion) => {
              localStorage.setItem(LOCAL_KEY, JSON.stringify(jornadasSustitucion));
              this.setDataSource(jornadasSustitucion);
              this.isLoading = false;
            },
            error: () => {
              this.loadFromCacheOrEmpty(
                LOCAL_KEY,
                "Ocurrió un error. Vuelva a intentarlo."
              );
              this.isLoading = false;
            },
          });
        } 
      },
      error: () => {
        this.loadFromCacheOrEmpty(
          LOCAL_KEY,
          "Ocurrió un error. Vuelva a intentarlo."
        );
        this.isLoading = false;
      },
    });

  }

  /**
   * Asigna el paginador y el ordenamiento a la tabla después de que la vista se inicializa.
   */
  ngAfterViewInit(): void {
    // Asigna el paginador y sort a la tabla de pendientes
  this.dataSourcePendientes.paginator = this.paginatorPendientes;
  this.dataSourcePendientes.sort = this.sortPendientes;
}

ngOnDestroy(): void {
    // Claves usadas en este componente
    localStorage.removeItem("sustitucionesPendientesCache");
    localStorage.removeItem("sustitucionesPendientesData");
    console.log('[ngOnDestroy] LocalStorage limpiado al salir de SustitucionesPendientesComponent');
  }

consultar(): void {
  const LOCAL_KEY_PENDIENTES = "sustitucionesPendientesData";
  if (this.selectedCodigo) {
    this.canViewTab = true;
    this.selectedTabIndex = 1;
    this.isLoading = true;

    this._service.sustitucionesPendientesConsultas({ fechaFiltro: this.selectedCodigo }).subscribe({
      next: (resp) => {
        const data = Array.isArray(resp.sustituciones) ? resp.sustituciones : [];
        this.dataSourcePendientes.data = data;
        // Guarda en localStorage
        localStorage.setItem(LOCAL_KEY_PENDIENTES, JSON.stringify(data));
        this.isLoading = false;
      },
      error: (err) => {
        this.dataSourcePendientes.data = [];
        localStorage.removeItem(LOCAL_KEY_PENDIENTES);
        this.isLoading = false;
      }
    });
  } else {
    alert("Por favor, seleccione una jornada.");
  }
}

  exportarSustituciones(): void {
    // Lógica para exportar las sustituciones
    this.exportProgressService.iniciarProgreso(
      (blob: Blob, fileName: string) => {
        this.exportProgressService.descargarArchivo(blob, fileName);
        this._snackBar.open('Archivo listo. La descarga comenzará en breve.', 'Cerrar', {
          duration: 4000
        });
      },
      () => this._service.exportarSustitucionesPendientes({fechaFiltro: this.selectedCodigo})
    );
  }


  onTabChange(event: any): void {
    // Índice del tab de resultados (ajusta si cambia el orden de los tabs)
    if (event.index === 1) {
  this.dataSourcePendientes.paginator = this.paginatorPendientes;
  this.dataSourcePendientes.sort = this.sortPendientes;
}
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
      this._snackBar.open(message, "Cerrar", {
        duration: 6000,
        horizontalPosition: "right",
      });
    } else {
      this.dataSourceH = new MatTableDataSource([]);
    }
  }

  /**
   * Devuelve una función para acceder a los datos de las columnas personalizadas al ordenar.
   */
  private getSortingDataAccessor() {
    return (item: jornadaActiva, property: string) => {
      if (property === "tipoIntervencion") {
        return item.tipoIntervencion?.nombreTipoIntervencion || "";
      }
      if (property === "coMonedaIso") {
        return item.codigoIsoDivisa?.coMonedaIso || "";
      }
      if (property === "tipoCambio") {
        return item.tipoCambioIntervencion &&
          item.tipoCambioIntervencion[0]?.tipoCambio != null
          ? item.tipoCambioIntervencion[0].tipoCambio
          : "";
      }
      if (property === "fechaValor") {
        return item.tipoCambioIntervencion &&
          item.tipoCambioIntervencion[0]?.fechaValor
          ? item.tipoCambioIntervencion[0].fechaValor
          : "";
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
      console.error("Fecha no válida:", dateString);
      return NaN;
    }
    const parts = dateString.split("/");
    if (parts.length === 3) {
      dateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Fecha no válida después de convertir:", dateString);
      return NaN;
    }
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    const startDayOfWeek = startOfMonth.getDay();
    return Math.ceil((dayOfMonth + startDayOfWeek) / 7);
  }

  /**
   * Enrutadores de navegación
   */
  inicio(): void {
    this._router.navigate(["/menu-principal/"]);
  }

  regresar(): void {
    this.selectedTabIndex = 0; // Regresa a la pestaña de selección
    this.selectedCodigo = null; // Limpia el código seleccionado
    this.dataSourcePendientes.data = []; // Limpia los datos de la tabla de pendientes
    this.canViewTab = false; // Desactiva la visibilidad de la pestaña de resultados
    this.isLoading = true; // Resetea el estado de carga
  }

  //#endregion
}