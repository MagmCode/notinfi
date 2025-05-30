// #region Imports
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { jornadaActiva, SustitucionesPendientes } from 'app/models/intervencion';
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
    "codBCV",
    "cliente",
    "nombreCliente",
    "fechaValor",
    "tipoOperacion",
    "monto",
    "tipoCambio",
    "cuentaDivisa",
    "cuentaBs",
    "moneda",
    "jornada",
  ];

  /** Fuente de datos para la tabla de jornadas */
  dataSourceH: MatTableDataSource<jornadaActiva> = new MatTableDataSource([]);

  // Fuente de datos para la tabla de pendientes
  dataSourcePendientes = new MatTableDataSource<SustitucionesPendientes>([]);

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
    private _snackBar: MatSnackBar
  ) {}

  //#region Métodos principales

  /**
   * Inicializa el componente y carga los datos de la jornada.
   * Consulta al backend.
   */
  ngOnInit(): void {
    this.isLoading = true;
    const LOCAL_KEY = "sustitucionesPendientesCache";
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

/** Datos de ejemplo para la tabla de pendientes. Borrar cuando se tenga la API lista */

//       this.dataSourcePendientes.data = [
//     {
//       codBCV: '001',
//       cliente: 'V12345678',
//       nombreCliente: 'Juan Pérez',
//       fechaValor: '2024-06-01',
//       tipoOperacion: 'Compra',
//       monto: 1000,
//       tipoCambio: 36.5,
//       cuentaDivisa: '0123-4567-89',
//       cuentaBs: '0102-3456-78',
//       moneda: 'USD',
//       jornada: 'J-001'
//     },
//     {
//       codBCV: '002',
//       cliente: 'V87654321',
//       nombreCliente: 'María Gómez',
//       fechaValor: '2024-06-02',
//       tipoOperacion: 'Venta',
//       monto: 2500,
//       tipoCambio: 37.1,
//       cuentaDivisa: '0123-9876-54',
//       cuentaBs: '0102-8765-43',
//       moneda: 'EUR',
//       jornada: 'J-002'
//     },
//     {
//       codBCV: '003',
//       cliente: 'J12345678',
//       nombreCliente: 'Empresa ABC',
//       fechaValor: '2024-06-03',
//       tipoOperacion: 'Compra',
//       monto: 5000,
//       tipoCambio: 36.8,
//       cuentaDivisa: '0123-1111-22',
//       cuentaBs: '0102-2222-33',
//       moneda: 'USD',
//       jornada: 'J-003'
//     },
//     {
//       codBCV: '004',
//       cliente: 'V11223344',
//       nombreCliente: 'Carlos Ruiz',
//       fechaValor: '2024-06-04',
//       tipoOperacion: 'Venta',
//       monto: 1500,
//       tipoCambio: 37.0,
//       cuentaDivisa: '0123-3333-44',
//       cuentaBs: '0102-4444-55',
//       moneda: 'USD',
//       jornada: 'J-004'
//     },
//     {
//       codBCV: '005',
//       cliente: 'J87654321',
//       nombreCliente: 'Empresa XYZ',
//       fechaValor: '2024-06-05',
//       tipoOperacion: 'Compra',
//       monto: 8000,
//       tipoCambio: 36.9,
//       cuentaDivisa: '0123-5555-66',
//       cuentaBs: '0102-6666-77',
//       moneda: 'EUR',
//       jornada: 'J-005'
//     },
//     {
//       codBCV: '006',
//       cliente: 'V55667788',
//       nombreCliente: 'Ana Torres',
//       fechaValor: '2024-06-06',
//       tipoOperacion: 'Venta',
//       monto: 1200,
//       tipoCambio: 37.2,
//       cuentaDivisa: '0123-7777-88',
//       cuentaBs: '0102-8888-99',
//       moneda: 'USD',
//       jornada: 'J-006'
//     },
//     {
//       codBCV: '007',
//       cliente: 'V99887766',
//       nombreCliente: 'Luis Fernández',
//       fechaValor: '2024-06-07',
//       tipoOperacion: 'Compra',
//       monto: 3000,
//       tipoCambio: 36.7,
//       cuentaDivisa: '0123-9999-00',
//       cuentaBs: '0102-0000-11',
//       moneda: 'USD',
//       jornada: 'J-007'
//     },
//     {
//       codBCV: '008',
//       cliente: 'J33445566',
//       nombreCliente: 'Servicios 123',
//       fechaValor: '2024-06-08',
//       tipoOperacion: 'Venta',
//       monto: 4000,
//       tipoCambio: 37.3,
//       cuentaDivisa: '0123-2222-33',
//       cuentaBs: '0102-3333-44',
//       moneda: 'EUR',
//       jornada: 'J-008'
//     },
//     {
//       codBCV: '009',
//       cliente: 'V22334455',
//       nombreCliente: 'Pedro López',
//       fechaValor: '2024-06-09',
//       tipoOperacion: 'Compra',
//       monto: 600,
//       tipoCambio: 36.6,
//       cuentaDivisa: '0123-4444-55',
//       cuentaBs: '0102-5555-66',
//       moneda: 'USD',
//       jornada: 'J-009'
//     },
//     {
//       codBCV: '010',
//       cliente: 'J44556677',
//       nombreCliente: 'Comercializadora QW',
//       fechaValor: '2024-06-10',
//       tipoOperacion: 'Venta',
//       monto: 7000,
//       tipoCambio: 37.4,
//       cuentaDivisa: '0123-6666-77',
//       cuentaBs: '0102-7777-88',
//       moneda: 'EUR',
//       jornada: 'J-010'
//     }
//   ];
  }

  /**
   * Asigna el paginador y el ordenamiento a la tabla después de que la vista se inicializa.
   */
  ngAfterViewInit(): void {
    // Asigna el paginador y sort a la tabla de pendientes
  this.dataSourcePendientes.paginator = this.paginatorPendientes;
  this.dataSourcePendientes.sort = this.sortPendientes;
}

  consultar(): void {
    if (this.selectedCodigo) {
      console.log("Código seleccionado: " + this.selectedCodigo);
      this.canViewTab = true // Permite ver la pestaña de resultados
      this.selectedTabIndex = 1; // Cambia a la pestaña de resultados
      this.isLoading = true; // Activa el estado de carga
    } else {
      alert("Por favor, seleccione una jornada.");
    }
  }

  exportarSustituciones(): void {
    // Lógica para exportar las sustituciones
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