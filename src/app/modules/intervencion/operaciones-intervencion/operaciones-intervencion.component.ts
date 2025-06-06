/**
 * Componente para la gestión y consulta de operaciones de intervención.
 * Permite filtrar operaciones por criterios, visualizar resultados, exportar, editar y procesar registros.
 * Incluye manejo de paginación, selección múltiple y persistencia de filtros/resultados en localStorage.
 */
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { intervencion, respuestaIntervencion } from 'app/models/intervencion';
import { ServiceService } from 'app/services/service.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { EditOperacionesIntervencionModalComponent } from './edit-operaciones-intervencion-modal/edit-operaciones-intervencion-modal.component'; 
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { interval, of, Subscription } from 'rxjs';
import { delay, take } from 'rxjs/operators';

@Component({
  selector: 'operaciones-intervencion',
  templateUrl: './operaciones-intervencion.component.html',
  styleUrls: ['./operaciones-intervencion.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class OperacionesIntervencionComponent implements OnInit, AfterViewInit, OnDestroy {
  //#region Variables

  /** Formulario reactivo para los criterios de búsqueda */
  operaInterForm: FormGroup;
  /** Índice de la pestaña seleccionada */
  selectedTabIndex = 0; 
  /** Mensaje de error para archivos */
  fileErrorInter: string = '';
  /** Variables auxiliares para los filtros */
  nroCedRif: string = '';
  nacionalidad: string = '';
  estatus: string = '';
  codDivisas: string = '';
  fechOper: string = '';
  /** Resumen de cantidad de operaciones */
  cantidad: string = '';
  /** Resumen de monto total */
  total: string = '';
  /** Lista de jornadas obtenidas */
  jornada: any[] = [];

  /** IDs seleccionados en la tabla */
  selectedIds: Set<any> = new Set<any>();

  /** Estado de carga para mostrar el loading bar */
  isLoading: boolean = false;

  /** Modelo de selección múltiple para la tabla */
  selection = new SelectionModel<intervencion>(true, []);

  /** Fecha máxima permitida en el calendario (hoy) */
  today = new Date();
  /** Permite ver la pestaña de operaciones */
  canViewTab: boolean = false;


   exportProgress = 0;
  showExportProgress = false;

  //#region  tablas

  /** Columnas a mostrar en la tabla de operaciones */
  displayedColumns: string[] = [
    'select', 'IdOper', 'nacionalidad', 'nroCedRif', 'nomCliente', 'operacion',
    'mtoDivisas', 'tasaCambio', 'codDivisas', 'ctaCliente', 'ctaClienteDivisas', 'estatus', 'edit'
  ];
  /** Opciones de posición para tooltips */
  positionOptions: TooltipPosition[] = ['below'];
  position = new FormControl(this.positionOptions[0]);

  /** Fuente de datos para la tabla de operaciones */
  dataSourceH: MatTableDataSource<intervencion>;
  /** Fuente de datos auxiliar (no usada en este contexto) */
  interven: MatTableDataSource<intervencion>;
  /** Lista de operaciones de intervención */
  intervencion: any[] = [];

  /** Referencia al componente de ordenamiento de Angular Material */
  @ViewChild(MatSort) sortH: MatSort = new MatSort;
  /** Referencia al paginador de Angular Material */
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //#endregion

  /**
   * Constructor del componente.
   * @param _formBuilder Servicio para construir formularios reactivos.
   * @param _router Servicio de rutas de Angular.
   * @param _service Servicio para obtener datos de intervención.
   * @param dialog Servicio para abrir diálogos modales.
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
    this.dataSourceH = new MatTableDataSource(this.intervencion); 
  }

  /**
   * Abre el diálogo de edición para una operación seleccionada.
   * @param row Fila de la operación a editar.
   */
  openEditDialog(row: any): void {
    const dialogRef = this.dialog.open(EditOperacionesIntervencionModalComponent, {
      width: '800px',
      height: '500px',
      data: row 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.consultarIntervencion();  
      }
    });
  }

  /**
   * Inicializa el paginador y el ordenamiento después de que la vista se inicializa.
   */
  ngAfterViewInit() {
    this.dataSourceH.paginator = this.paginator;
    this.dataSourceH.sort = this.sortH;
  }

  /**
   * Maneja el cambio de pestaña, limpiando filtros y resultados si se regresa a la búsqueda.
   * @param event Evento de cambio de pestaña.
   */
  onTabChange(event: any): void {
    if (event.index === 0) {
      localStorage.removeItem('operacionesIntervencionBusqueda');
      localStorage.removeItem('operacionesIntervencionResultados');
      localStorage.removeItem('operacionesIntervencionCantidad');
      localStorage.removeItem('operacionesIntervencionTotal');
      localStorage.removeItem('operacionesIntervencionJornada');
      this.dataSourceH = new MatTableDataSource([]);
      this.intervencion = [];
      this.cantidad = '';
      this.total = '';
      this.jornada = [];
    }
    if (event.index === 1) {
      this.dataSourceH.paginator = this.paginator;
      this.dataSourceH.sort = this.sortH;
    }
  }

  /**
   * Inicializa el componente y recupera filtros/resultados desde localStorage si existen.
   */
  ngOnInit(): void {
    const savedBusqueda = localStorage.getItem('operacionesIntervencionBusqueda');
    if (savedBusqueda) {
      const busqueda = JSON.parse(savedBusqueda);
      this.operaInterForm = this._formBuilder.group({
        nroCedRif: [busqueda.nroCedRif],
        nacionalidad: [busqueda.nacionalidad],
        estatus: [busqueda.estatus],
        codDivisas: [busqueda.codDivisas],
        fechOper: [busqueda.fechOper, [Validators.required]],
      });

      // Recupera los resultados guardados
      const savedResultados = localStorage.getItem('operacionesIntervencionResultados');
      if (savedResultados) {
        const resultados = JSON.parse(savedResultados);
        const safeResultados = Array.isArray(resultados) ? resultados : [];
        this.dataSourceH = new MatTableDataSource(safeResultados);
        this.intervencion = safeResultados;
        this.selectedTabIndex = 1;
        this.canViewTab = true;
      } else {
        this.dataSourceH = new MatTableDataSource([]);
        this.canViewTab = false;
      }

      // Recupera cantidad, total y jornada
      const savedCantidad = localStorage.getItem('operacionesIntervencionCantidad');
      if (savedCantidad) {
        this.cantidad = JSON.parse(savedCantidad);
      }
      const savedTotal = localStorage.getItem('operacionesIntervencionTotal');
      if (savedTotal) {
        this.total = JSON.parse(savedTotal);
      }
      const savedJornada = localStorage.getItem('operacionesIntervencionJornada');
      if (savedJornada) {
        this.jornada = JSON.parse(savedJornada);
      }
    } else {
      const today = new Date();
      this.operaInterForm = this._formBuilder.group({
        nroCedRif: [''],
        nacionalidad: [''],
        estatus: [''],
        codDivisas: [''],
        fechOper: [today, [Validators.required]],
      });

      this.dataSourceH = new MatTableDataSource([]);
    }
  }

  /**
   * Consulta las operaciones de intervención según los filtros seleccionados.
   * Guarda los resultados y filtros en localStorage.
   */
  consultarIntervencion() {
    this.isLoading = true;
    const form = this.operaInterForm.value;

    // Solo la fecha es requerida
    if (this.operaInterForm.controls['fechOper'].invalid) {
      this._snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar']
      });
      this.isLoading = false;
      return;
    }

    this._service.consultaIntervencion('intervencionFiltro',form).subscribe({
      next: (resp: respuestaIntervencion) => {
        this.intervencion = resp.respIntervencion;
        this.dataSourceH = new MatTableDataSource(this.intervencion);
        this.dataSourceH.paginator = this.paginator;
        this.dataSourceH.sort = this.sortH;
        this.selectedTabIndex = 1;
        this.canViewTab = true;
        this.cantidad = resp.cantidad;
        this.total = resp.totales;
        this.jornada = resp.jornadasList;
        // Guarda los criterios y resultados después de consultar
        localStorage.setItem('operacionesIntervencionBusqueda', JSON.stringify(form));
        localStorage.setItem('operacionesIntervencionResultados', JSON.stringify(this.intervencion));
        localStorage.setItem('operacionesIntervencionCantidad', JSON.stringify(this.cantidad));
        localStorage.setItem('operacionesIntervencionTotal', JSON.stringify(this.total));
        localStorage.setItem('operacionesIntervencionJornada', JSON.stringify(this.jornada));
      },
      error: (err) => {
        console.error("Error", err);
        alert('Ocurrió un error inesperado, por favor vuelve a intentarlo')
      },
      complete: () => {
        this.isLoading = false;
        this.dataSourceH.paginator = this.paginator;
      }
    });
  }

  /**
   * Selecciona o deselecciona todas las filas de la tabla.
   */
  selectAll() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.selectedIds.clear();
    } else {
      this.selection.select(...this.dataSourceH.data);
      this.selectedIds = new Set(this.dataSourceH.data.map(row => row.idOper));
      this.obtenerIdsSeleccionados();
    }
  }
  
  /**
   * Verifica si todas las filas están seleccionadas.
   */
  isAllSelected(): boolean {
    if (!this.dataSourceH || !this.dataSourceH.data) {
      return false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceH.data.length;
    return numSelected === numRows;
  }
  
  /**
   * Obtiene los IDs seleccionados y los muestra en consola.
   */
  obtenerIdsSeleccionados() {
    const selectedIdsArray = Array.from(this.selectedIds);
    console.log('IDs seleccionados:', selectedIdsArray);
  }
  
  /**
   * Maneja el cambio de selección de un checkbox individual.
   * @param event Evento del checkbox.
   * @param row Fila correspondiente.
   */
  onCheckboxChange(event: MatCheckboxChange, row: intervencion) {
    if (event.checked) {
      this.selection.select(row);
      this.selectedIds.add(row.idOper);
    } else {
      this.selection.deselect(row);
      this.selectedIds.delete(row.idOper);
    }
    this.obtenerIdsSeleccionados();
  }
  
  /**
   * Procesa las filas seleccionadas (ejemplo: muestra un alert con los IDs).
   */
  processSelectedRows() {
    const selectedIdsArray = Array.from(this.selectedIds);
    alert(`Selected IDs: ${selectedIdsArray.join(', ')}`);
  }

  /**
   * Exporta los resultados de la consulta a un archivo Excel.
   */
 exportarExcel(): void {
    this.exportProgress = 0;
    this.showExportProgress = true;

    const steps = 14; // 7s / 0.5s
    /** Simula el progreso de exportación cada 500ms */
    const progressSub: Subscription = interval(100).pipe(take(steps + 1)).subscribe(i => {
      this.exportProgress = Math.round((i / steps) * 100);
      if (this.exportProgress === 100) {
        this.showExportProgress = false;
      }
    });

    /** Seguimiento del progreso de exportación mediante WebSocket*/
    // this.exportService.getExportProgress().subscribe(progress => {
    //   this.exportProgress = progress;
    //   if (progress === 100) {
    //     this.showExportProgress = false;
    //   }
    // });

    // Llama al servicio real para exportar el archivo
    this._service.exportarIntervencion('intervencionFiltroExportar', this.operaInterForm.value)
      .subscribe({
        next: (blob: Blob) => {
          progressSub.unsubscribe();
          this.showExportProgress = false;
          this._snackBar.open('Archivo listo. La descarga comenzará en breve.', 'Cerrar', {
            duration: 4000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar']
          });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Intervenciones.xls';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          progressSub.unsubscribe();
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

    // --- Simulación de retraso para pruebas ---
    // of(new Blob(['Simulación de archivo grande'], { type: 'application/vnd.ms-excel' }))
    //   .pipe(delay(7000))
    //   .subscribe({
    //     next: (blob: Blob) => {
    //       progressSub.unsubscribe();
    //       this.showExportProgress = false;
    //       this._snackBar.open('Archivo listo. La descarga comenzará en breve.', 'Cerrar', {
    //         duration: 4000,
    //         horizontalPosition: 'center',
    //         verticalPosition: 'bottom',
    //         panelClass: ['custom-snackbar']
    //       });
    //       const url = window.URL.createObjectURL(blob);
    //       const a = document.createElement('a');
    //       a.href = url;
    //       a.download = 'Intervenciones.xls';
    //       a.click();
    //       window.URL.revokeObjectURL(url);
    //     },
    //     error: (err) => {
    //       progressSub.unsubscribe();
    //       this.showExportProgress = false;
    //       this._snackBar.open('Error al exportar el archivo.', 'Cerrar', {
    //         duration: 4000,
    //         horizontalPosition: 'center',
    //         verticalPosition: 'bottom',
    //         panelClass: ['custom-snackbar']
    //       });
    //       console.error('Error al exportar:', err);
    //     }
    //   });
}
  /**
   * Navega al menú principal.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/'])
  }

  /**
   * Regresa a la pestaña de búsqueda y limpia los filtros/resultados.
   * Restablece la fecha al día actual.
   */
  regresar(): void {
    this.selectedTabIndex = 0;
    this.canViewTab = false;
    this.operaInterForm.reset();
    // Asigna la fecha del día nuevamente
    const today = new Date();
    this.operaInterForm.get('fechOper')?.setValue(today);

    this.dataSourceH.data = [];
    this.isLoading = false;
    this.selectedIds.clear();
    this.selection.clear();
    this.fileErrorInter = '';
    // Limpia localStorage al regresar a búsqueda
    localStorage.removeItem('operacionesIntervencionBusqueda');
    localStorage.removeItem('operacionesIntervencionResultados');
    localStorage.removeItem('operacionesIntervencionCantidad');
    localStorage.removeItem('operacionesIntervencionTotal');
    localStorage.removeItem('operacionesIntervencionJornada');
    this.cantidad = '';
    this.total = '';
    this.jornada = [];
  }

  /**
   * Limpia el localStorage al destruir el componente.
   */
  ngOnDestroy(): void {
    localStorage.removeItem('operacionesIntervencionBusqueda');
    localStorage.removeItem('operacionesIntervencionResultados');
    localStorage.removeItem('operacionesIntervencionCantidad');
    localStorage.removeItem('operacionesIntervencionTotal');
    localStorage.removeItem('operacionesIntervencionJornada');
  }
}