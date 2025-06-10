/**
 * Componente para la gestión y consulta de Intención de Retiro.
 * Permite filtrar por criterios, visualizar resultados en tabla, exportar a Excel y limpiar filtros/resultados.
 * Incluye manejo de paginación, selección múltiple, persistencia de filtros/resultados en localStorage y validaciones personalizadas.
 */

import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'app/services/service.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IntencionRetiro, TableFilter, BusquedaCriterios } from 'app/models/intencionRetiro';
import { HttpEventType } from '@angular/common/http';
import { WebSocketService } from 'app/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-intencion-retiro',
  templateUrl: './intencion-retiro.component.html',
  styleUrls: ['./intencion-retiro.component.scss'],
})
export class IntencionRetiroComponent implements OnInit, AfterViewInit, OnDestroy {

  // #region Constantes
  private readonly STORAGE_BUSQUEDA = 'intencionRetiroBusqueda';
  private readonly STORAGE_RESULTADOS = 'intencionRetiroResultados';

  // #region Variables públicas

  intencionRetiroFb: FormGroup;
  selectedTabIndex = 0;
  agencias: any[] = [];
  lastBusqueda: BusquedaCriterios | null = null;
  today: Date = new Date();
  tableFilter: TableFilter = { text: '', estatus: 'todas' };
  selectedIds: Set<any> = new Set<any>();
  isLoading = false;
  selection = new SelectionModel<IntencionRetiro>(true, []);
  exportProgress = 0;
  showExportProgress = false;
  descargandoArchivo = false;
  displayedColumns: string[] = [
    'rif', 'nombreEmpresa', 'moneda', 'montoDivisa', 'numeroCuentaOrigen',
    'porcentajeComision', 'montoComision', 'agencia', 'estatus', 'fechaHoraOperacion'
  ];
  positionOptions: TooltipPosition[] = ['below'];
  position = new FormControl(this.positionOptions[0]);
  dataSourceH: MatTableDataSource<IntencionRetiro>;
  intervencion: any[] = [];

  @ViewChild(MatSort) sortH: MatSort;
  @ViewChild(MatPaginator) paginatorH: MatPaginator;

  // #region Variables privadas
  private wsSubscription: Subscription;

  // #region Constructor
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _service: ServiceService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private websocketService: WebSocketService
  ) {
    this.dataSourceH = new MatTableDataSource(this.intervencion);
  }

  // #region Ciclo de vida

  /**
   * Inicializa el paginador y el ordenamiento de la tabla después de la vista.
   */
  ngAfterViewInit() {
    this.dataSourceH.paginator = this.paginatorH;
    this.dataSourceH.sort = this.sortH;
  }

  /**
   * Inicializa el componente, carga agencias, recupera filtros/resultados guardados y configura el formulario.
   */
  ngOnInit(): void {
    this.cargarAgencias();
    this.restaurarBusquedaGuardada();
    this.suscribirWebSocketExport();
  }

  /**
   * Limpia los datos guardados y la suscripción al destruir el componente.
   */
  ngOnDestroy(): void {
    localStorage.removeItem(this.STORAGE_BUSQUEDA);
    localStorage.removeItem(this.STORAGE_RESULTADOS);
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    console.log('Datos de búsqueda y resultados eliminados al salir del componente.');
  }

  // #region Métodos públicos

  /**
   * Consulta la intención de retiro según los criterios del formulario.
   */
  consultarIntencionRetiro(): void {
    if (this.intencionRetiroFb.invalid) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }
    this.isLoading = true;

    const formValue = this.intencionRetiroFb.value;
    const agenciaDescripcion = this.obtenerDescripcionAgencia(formValue.agencia);

    const requestData = {
      fechaDesde: this.formatearFecha(formValue.fechaDesde),
      fechaHasta: this.formatearFecha(formValue.fechaHasta)
    };

    const filtrosFront = {
      nacionalidad: formValue.nacionalidad?.toLowerCase() || '',
      documento: formValue.documento?.toLowerCase() || '',
      agencia: agenciaDescripcion?.toLowerCase() || '',
      estatus: formValue.estatus?.toLowerCase() || ''
    };

    this.lastBusqueda = { ...requestData, ...filtrosFront };
    localStorage.setItem(this.STORAGE_BUSQUEDA, JSON.stringify(this.lastBusqueda));

    this._service.consultaIntencionRetiro(requestData).subscribe({
      next: (data: IntencionRetiro[]) => {
        this.dataSourceH = new MatTableDataSource(data);
        this.configurarFiltroTabla();
        this.dataSourceH.filter = JSON.stringify({ ...filtrosFront, text: '' });
        localStorage.setItem(this.STORAGE_RESULTADOS, JSON.stringify(data));
        this.selectedTabIndex = 1;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al consultar Intención Retiro:', err);
        alert('Ocurrió un error al realizar la consulta.');
      }
    });
  }

  /**
   * Maneja el cambio de pestaña en el componente.
   * @param event Evento de cambio de pestaña
   */
  onTabChange(event: any): void {
    if (event.index === 1) {
      this.dataSourceH.paginator = this.paginatorH;
      this.dataSourceH.sort = this.sortH;
    } else if (event.index === 0) {
      this.inicializarFormulario();
      this.limpiarBusquedaGuardada();
    }
  }

  /**
   * Exporta los resultados a Excel y muestra el progreso.
   */
  exportarExcel(): void {
    if (!this.lastBusqueda) {
      alert('Primero realice una consulta válida.');
      return;
    }
    this.exportProgress = 0;
    this.showExportProgress = true;
    this.descargandoArchivo = false;

    const requestData = {
      fechaDesde: this.lastBusqueda.fechaDesde,
      fechaHasta: this.lastBusqueda.fechaHasta
    };

    this._service.exportarIntencionRetiro(requestData).subscribe({
      error: (err) => {
        this.showExportProgress = false;
        this._snackBar.open('Error al exportar el archivo.', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar']
        });
        console.error('Error al exportar:', err);
      }
    });
  }

  /**
   * Aplica el filtro de búsqueda a la tabla.
   * @param event Evento de input
   */
  applyFilterH(event: Event) {
    const searchText = (event.target as HTMLInputElement).value;
    const filtrosFront = this.lastBusqueda
      ? {
          nacionalidad: this.lastBusqueda.nacionalidad || '',
          documento: this.lastBusqueda.documento || '',
          agencia: this.lastBusqueda.agencia || '',
          estatus: this.lastBusqueda.estatus || ''
        }
      : { nacionalidad: '', documento: '', agencia: '', estatus: '' };

    this.dataSourceH.filter = JSON.stringify({ ...filtrosFront, text: searchText });
    if (this.dataSourceH.paginator) {
      this.dataSourceH.paginator.firstPage();
    }
  }

  /**
   * Navega al menú principal.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/']);
  }

  /**
   * Limpia los datos guardados y reinicia el formulario.
   */
  regresar(): void {
    this.limpiarBusquedaGuardada();
    this.inicializarFormulario();
    this.selectedTabIndex = 0;
  }

  // #region Métodos privados

  /**
   * Inicializa el formulario de búsqueda.
   * @param valores Valores opcionales para inicializar el formulario
   */
  private inicializarFormulario(valores?: any) {
    this.intencionRetiroFb = this._formBuilder.group({
      fechaDesde: [valores?.fechaDesde || this.today, Validators.required],
      fechaHasta: [valores?.fechaHasta || this.today, Validators.required],
      nacionalidad: [valores?.nacionalidad || ''],
      documento: [valores?.documento || ''],
      agencia: [valores?.agencia || ''],
      estatus: [valores?.estatus || '']
    }, { validators: this.fechaHastaMayorQueFechaDesde });
    this.dataSourceH = new MatTableDataSource([]);
  }

  /**
   * Carga la lista de agencias comerciales.
   */
  private cargarAgencias() {
    this._service.consultaOficinascomerciales().subscribe({
      next: (respuesta: any) => {
        if (respuesta && respuesta.data && Array.isArray(respuesta.data)) {
          this.agencias = respuesta.data.map((oficina: any) => ({
            nro: oficina.nro,
            nombre: oficina.descripcion,
          })).sort((a, b) => a.nro.localeCompare(b.nro, undefined, { numeric: true }));
        } else {
          this.agencias = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar las agencias:', err);
      }
    });
  }

  /**
   * Restaura la búsqueda y resultados guardados en localStorage.
   */
  private restaurarBusquedaGuardada() {
    const savedBusqueda = localStorage.getItem(this.STORAGE_BUSQUEDA);
    const savedResultados = localStorage.getItem(this.STORAGE_RESULTADOS);

    if (savedBusqueda && savedResultados) {
      const busqueda = JSON.parse(savedBusqueda);
      this.lastBusqueda = busqueda;
      this.inicializarFormulario(busqueda);

      const resultados = JSON.parse(savedResultados);
      this.dataSourceH = new MatTableDataSource(resultados);
      this.configurarFiltroTabla();
      const filtrosFront = {
        nacionalidad: busqueda.nacionalidad || '',
        documento: busqueda.documento || '',
        agencia: busqueda.agencia || '',
        estatus: busqueda.estatus || ''
      };
      this.dataSourceH.filter = JSON.stringify({ ...filtrosFront, text: '' });
      this.selectedTabIndex = 1;
    } else {
      this.inicializarFormulario();
    }
  }

  /**
   * Limpia los datos de búsqueda y resultados guardados.
   */
  private limpiarBusquedaGuardada() {
    localStorage.removeItem(this.STORAGE_BUSQUEDA);
    localStorage.removeItem(this.STORAGE_RESULTADOS);
  }

  /**
   * Configura el filtro personalizado para la tabla.
   */
  private configurarFiltroTabla() {
    this.dataSourceH.filterPredicate = (row: IntencionRetiro, filter: string) => {
      let parsed: any;
      try {
        parsed = JSON.parse(filter);
      } catch {
        parsed = { text: filter };
      }
      const matchNacionalidad = !parsed.nacionalidad || (row.nacionalidad?.toLowerCase().includes(parsed.nacionalidad));
      const matchDocumento = !parsed.documento || (row.documento?.toLowerCase().includes(parsed.documento));
      const matchAgencia = !parsed.agencia || (row.agencia?.toLowerCase().includes(parsed.agencia));
      const matchEstatus = !parsed.estatus || (row.estatus?.toLowerCase().includes(parsed.estatus));
      const search = parsed.text?.trim().toLowerCase() || '';
      const matchSearch =
        !search ||
        (row.rif && row.rif.toLowerCase().includes(search)) ||
        (row.nombreEmpresa && row.nombreEmpresa.toLowerCase().includes(search)) ||
        (row.moneda && row.moneda.toLowerCase().includes(search)) ||
        (row.montoDivisa && row.montoDivisa.toString().toLowerCase().includes(search)) ||
        (row.numeroCuentaOrigen && row.numeroCuentaOrigen.toLowerCase().includes(search)) ||
        (row.porcentajeComision && row.porcentajeComision.toString().toLowerCase().includes(search)) ||
        (row.montoComision && row.montoComision.toString().toLowerCase().includes(search)) ||
        (row.agencia && row.agencia.toLowerCase().includes(search)) ||
        (row.estatus && row.estatus.toLowerCase().includes(search)) ||
        (row.fechaHoraOperacion && row.fechaHoraOperacion.toLowerCase().includes(search));
      return matchNacionalidad && matchDocumento && matchAgencia && matchEstatus && matchSearch;
    };
  }

  /**
   * Suscribe al WebSocket para mostrar el progreso y descargar el archivo cuando esté listo.
   */
  private suscribirWebSocketExport() {
    if (this.wsSubscription) {
      this.wsSubscription.unsubscribe();
    }
    this.wsSubscription = this.websocketService.progress$.subscribe(data => {
      if (!data) return;
      if ((data.status === 'progress' || data.status === 'start') && this.showExportProgress) {
        this.exportProgress = data.progress || 0;
      }
      if (
        data.status === 'complete' &&
        data.fileName &&
        this.showExportProgress &&
        !this.descargandoArchivo
      ) {
        this.exportProgress = 100;
        this.showExportProgress = false;
        this.descargandoArchivo = true;
        if (this.lastBusqueda) {
          const requestData = {
            fechaDesde: this.lastBusqueda.fechaDesde,
            fechaHasta: this.lastBusqueda.fechaHasta
          };
          this._service.exportarIntencionRetiro(requestData).subscribe({
            next: (event) => {
              if (event.type === HttpEventType.Response) {
                let nombre = data.fileName;
                if (!nombre.endsWith('.xlsx') && !nombre.endsWith('.xls')) {
                  nombre += '.xlsx';
                }
                this.descargarArchivo(event.body as Blob, nombre);
                this._snackBar.open('Archivo listo. La descarga comenzará en breve.', 'Cerrar', {
                  duration: 4000,
                  horizontalPosition: 'center',
                  verticalPosition: 'bottom',
                  panelClass: ['custom-snackbar']
                });
                this.descargandoArchivo = false;
              }
            },
            error: () => {
              this.descargandoArchivo = false;
            }
          });
        }
      }
    });
  }

  /**
   * Descarga un archivo Blob en el navegador.
   * @param blob Archivo Blob a descargar
   * @param nombre Nombre del archivo
   */
  private descargarArchivo(blob: Blob, nombre: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  /**
   * Devuelve la descripción de la agencia según el número.
   * @param nroAgencia Número de agencia
   */
  private obtenerDescripcionAgencia(nroAgencia: string): string {
    if (!nroAgencia || nroAgencia === 'TODAS') return '';
    const agenciaObj = this.agencias.find(a => a.nro === nroAgencia);
    return agenciaObj ? agenciaObj.nombre : '';
  }

  /**
   * Formatea una fecha a dd/MM/yyyy.
   * @param fecha Fecha a formatear
   */
  private formatearFecha(fecha: any): string {
    let dateObj: Date;
    if (fecha instanceof Date) {
      dateObj = fecha;
    } else if (fecha && typeof fecha === 'object' && typeof fecha.toDate === 'function') {
      dateObj = fecha.toDate();
    } else {
      dateObj = new Date(fecha);
    }
    const dia = dateObj.getDate().toString().padStart(2, '0');
    const mes = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const anio = dateObj.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  /**
   * Valida que la fecha hasta sea mayor o igual a la fecha desde.
   * @param group FormGroup a validar
   */
  private fechaHastaMayorQueFechaDesde(group: FormGroup): { [key: string]: boolean } | null {
    const fechaDesde = group.get('fechaDesde')?.value;
    const fechaHasta = group.get('fechaHasta')?.value;
    if (fechaDesde && fechaHasta && fechaHasta < fechaDesde) {
      return { fechaHastaMenor: true };
    }
    return null;
  }
}