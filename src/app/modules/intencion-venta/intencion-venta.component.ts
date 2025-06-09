/**
 * Componente para la gestión y consulta de Intención de Venta.
 * Permite al usuario buscar intenciones de venta por rango de fechas y visualizar los resultados en una tabla con paginación, filtrado y exportación.
 * Incluye dos pestañas principales: Búsqueda y Resultado.
 * - La pestaña "Búsqueda" contiene el formulario reactivo para seleccionar criterios y realizar la consulta.
 * - La pestaña "Resultado" muestra los resultados obtenidos, permite filtrar por texto, exportar a Excel y navegar entre páginas.
 * El componente utiliza Angular Material para la UI y Tailwind para la disposición responsiva.
 * Los datos y criterios de búsqueda se almacenan en localStorage para mantener el estado entre recargas.
 */

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'app/services/service.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IntencionVenta } from 'app/models/intencionVenta'; 
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-intencion-venta',
  templateUrl: './intencion-venta.component.html',
  styleUrls: ['./intencion-venta.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class IntencionVentaComponent implements OnInit {
  /** Referencia al formulario de Angular */
  @ViewChild('intencionVentaForm') intencionVentaForm: NgForm;
  /** Referencia al grupo de pestañas */
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  //#region Variables

  /** Formulario reactivo para criterios de búsqueda */
  intencionVentaFb: FormGroup;
  /** Últimos criterios de búsqueda utilizados */
  lastBusqueda: { fechaDesde: string; fechaHasta: string } | null = null;
  /** Índice de la pestaña seleccionada */
  selectedTabIndex = 0; 
  /** Fecha actual */
  today: Date = new Date();
  /** IDs seleccionados en la tabla */
  selectedIds: Set<any> = new Set<any>();
  /** Estado de carga para mostrar el loading bar */
  isLoading: boolean = false;
  /** Modelo de selección para la tabla */
  selection = new SelectionModel<IntencionVenta>(true, []);
  /** Controla la visibilidad de la pestaña de resultados */
  canViewTab: boolean = false;
  /** Progreso de la exportación */
  exportProgress = 0;
  /** Controla la visibilidad del progreso de exportación */
  showExportProgress = false;

  //#region  tablas

  /** Columnas a mostrar en la tabla de resultados */
  displayedColumns: string[] = [
    "numeroReferencia",
    "rif",
    "nombreEmpresa",
    "cuentaOrigen",
    "cuentaDestino",
    "montoDivisa",
    "moneda",
    "tasaPropuesta",
    "actividadEconomica",
    "destinoFondos",
    "fechaSolicitud",
    "fechaRegistro"
  ];

  /** Opciones de posición para tooltips */
  positionOptions: TooltipPosition[] = ['below'];
  /** Control de posición para tooltips */
  position = new FormControl(this.positionOptions[0]);
  /** Fuente de datos para la tabla de resultados */
  dataSourceH: MatTableDataSource<IntencionVenta>;
  /** Fuente de datos auxiliar (no utilizada en este fragmento) */
  interven: MatTableDataSource<IntencionVenta>;
  /** Arreglo auxiliar para intervenciones (no utilizado en este fragmento) */
  intervencion: any[] = [];

  /** Referencia al componente de ordenamiento de Angular Material */
  @ViewChild(MatSort) sortH: MatSort;
  /** Referencia al paginador de Angular Material */
  @ViewChild(MatPaginator) paginatorH: MatPaginator;

  // #region Constructor
  /**
   * Constructor del componente.
   * @param _formBuilder Servicio para construir formularios reactivos.
   * @param _router Servicio de rutas de Angular.
   * @param _service Servicio para consultar intenciones de venta.
   * @param dialog Servicio para diálogos modales.
   * @param _snackBar Servicio para mostrar notificaciones.
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,    
    private _service: ServiceService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,               
  ) 
  {
    this.dataSourceH = new MatTableDataSource([]); // Siempre inicializar con array vacío
  }

  /**
   * Inicializa el paginador y el ordenamiento después de que la vista se ha renderizado.
   */
  ngAfterViewInit() {
    this.dataSourceH.paginator = this.paginatorH;
    this.dataSourceH.sort = this.sortH;
  }

  // #region ngOnInit
  /**
   * Inicializa el formulario y recupera datos guardados en localStorage si existen.
   * Si hay criterios y resultados guardados, los carga y muestra la pestaña de resultados.
   */
  ngOnInit(): void {
    // Recupera los criterios de búsqueda guardados
    const savedBusqueda = localStorage.getItem('intencionVentaBusqueda');
    if (savedBusqueda) {
        const busqueda = JSON.parse(savedBusqueda);
        this.lastBusqueda = busqueda; // Guardar criterios de búsqueda

        // Rellena el formulario con los datos guardados
        this.intencionVentaFb = this._formBuilder.group({
            fechaDesde: [busqueda.fechaDesde, Validators.required],
            fechaHasta: [busqueda.fechaHasta, Validators.required],
        }, { validators: this.fechaHastaMayorQueFechaDesde }); 

        // Recupera los resultados guardados
        const savedResultados = localStorage.getItem('intencionVentaResultados');
        if (savedResultados) {
            const resultados = JSON.parse(savedResultados);
            const safeResultados = Array.isArray(resultados) ? resultados : [];
            this.dataSourceH = new MatTableDataSource(safeResultados);
            this.selectedTabIndex = 1;
            this.canViewTab = true;
        } else {
            this.dataSourceH = new MatTableDataSource([]); // Si no hay resultados, array vacío
        }
    } else {
        // Inicializa el formulario si no hay datos guardados
        this.intencionVentaFb = this._formBuilder.group({
            fechaDesde: [this.today, Validators.required],
            fechaHasta: [this.today, Validators.required],
        }, { validators: this.fechaHastaMayorQueFechaDesde }); 
        this.dataSourceH = new MatTableDataSource([]); // Siempre array vacío
    }
  }

  /**
   * Validador personalizado para asegurar que la fecha hasta no sea menor que la fecha desde.
   */
  private fechaHastaMayorQueFechaDesde(group: FormGroup): { [key: string]: boolean } | null {
    const fechaDesde = group.get('fechaDesde')?.value;
    const fechaHasta = group.get('fechaHasta')?.value;

    if (fechaDesde && fechaHasta && fechaHasta < fechaDesde) {
      return { fechaHastaMenor: true };
    }
    return null;
  }

  /**
   * Limpia los datos guardados en localStorage al destruir el componente.
   */
  ngOnDestroy(): void {
    // Limpia los datos guardados
    localStorage.removeItem('intencionVentaBusqueda');
    localStorage.removeItem('intencionVentaResultados');
    console.log('Datos de búsqueda y resultados eliminados al salir del componente.');
  }

  //#region Suscripcion

  /**
   * Realiza la consulta de intenciones de venta según los criterios del formulario.
   * Guarda los criterios y resultados en localStorage y muestra la pestaña de resultados.
   */
  consultarintencionVenta(): void {
    if (this.intencionVentaFb.invalid) {
        alert('Por favor, completa los campos obligatorios.');
        return;
    }

    this.isLoading = true;

    const formValue = this.intencionVentaFb.value;
    const requestData = {
      fechaDesde: this.formatearFecha(formValue.fechaDesde),
      fechaHasta: this.formatearFecha(formValue.fechaHasta),
    };
    this.lastBusqueda = requestData; // Guardar criterios de búsqueda
    localStorage.setItem('intencionVentaBusqueda', JSON.stringify(requestData));
    console.log('Datos de consulta (formateados):', requestData);
    this._service.consultaIntencionVenta(requestData).subscribe({
      next: (data: IntencionVenta[]) => {
          const safeData = Array.isArray(data) ? data : [];
          this.dataSourceH = new MatTableDataSource(safeData);
          localStorage.setItem('intencionVentaResultados', JSON.stringify(safeData));
          console.log('Resultados guardados en localStorage:', safeData);
          this.selectedTabIndex = 1; // Cambia al tab de resultados
          this.canViewTab = true; // Habilita la vista de resultados
      },
      error: (err) => {
          console.error('Error al consultar Intención Retiro:', err);
          alert('Ocurrió un error al realizar la consulta.');
      }
    });
  }

  /**
   * Exporta los resultados de la consulta a un archivo Excel.
   */
  exportarExcel(): void {
  if (!this.lastBusqueda) {
    alert('Primero realice una consulta válida.');
    return;
  }

  this.exportProgress = 0;
  this.showExportProgress = true;

  this._service.exportarIntencionVenta(this.lastBusqueda).subscribe({
    next: (event) => {
      if (event.type === HttpEventType.DownloadProgress) {
        if (event.total) {
          this.exportProgress = Math.round(100 * event.loaded / event.total);
        }
      } else if (event.type === HttpEventType.Response) {
        let fileName = 'intencion_venta.xls'; // Valor por defecto
        const contentDisposition = event.headers?.get('Content-Disposition');
        if (contentDisposition) {
          const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
          if (matches && matches[1]) {
            fileName = matches[1];
          }
        }
        this.exportProgress = 100;
        this.showExportProgress = false;
        this.descargarArchivo(event.body as Blob, fileName);
        this._snackBar.open('Archivo listo. La descarga comenzará en breve.', 'Cerrar', {
          duration: 4000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['custom-snackbar']
        });
      }
    },
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

private descargarArchivo(blob: Blob, nombre: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  window.URL.revokeObjectURL(url);
}

  /**
   * Aplica un filtro de texto a la tabla de resultados.
   * @param event Evento de entrada del filtro.
   */
  applyFilterH(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceH.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceH.paginator) {
      this.dataSourceH.paginator.firstPage();
    }
  }

  /**
   * Formatea una fecha a string en formato dd/mm/yyyy.
   * @param fecha Fecha a formatear.
   */
  private formatearFecha(fecha: any): string {
    // Si ya es Date, se usa; si es string, se conviérte; si es Moment, usa toDate()
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
   * Maneja el cambio de pestaña. Inicializa el paginador y el ordenamiento al mostrar resultados.
   * Limpia el formulario y los datos guardados al volver a la pestaña de búsqueda.
   * @param event Evento de cambio de pestaña.
   */
  onTabChange(event: any): void {
    if (event.index === 1) { // Índice del tab de resultados
        this.dataSourceH.paginator = this.paginatorH;
        this.dataSourceH.sort = this.sortH;
        console.log('Paginador inicializado:', this.dataSourceH.paginator);
    } else if (event.index === 0) {
        // Restaurar el formulario a valores por defecto (fechas del día) al volver al tab de búsqueda
        this.intencionVentaFb = this._formBuilder.group({
          fechaDesde: [this.today, Validators.required],
          fechaHasta: [this.today, Validators.required],
        }, { validators: this.fechaHastaMayorQueFechaDesde });
        // Limpia los datos guardados
        localStorage.removeItem('intencionVentaBusqueda');
        localStorage.removeItem('intencionVentaResultados');
    }
  }

  /**
   * Navega al menú principal.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/']);
  }

  /**
   * Regresa a la pestaña de búsqueda y oculta la pestaña de resultados.
   */
  regresar(): void {
    this.selectedTabIndex = 0; 
    this.canViewTab = false; // Deshabilita la vista de resultados
  }
}