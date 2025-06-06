/**
 * consultabcv-intervencion.component.ts
 * Componente para la consulta BCV de intervención.
 * Permite seleccionar una fecha (preseleccionada al día de hoy y sin permitir fechas futuras)
 * y cargar un archivo, validando ambos campos antes de enviar.
 * 
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
import { EditOperacionesIntervencionModalComponent } from '../operaciones-intervencion/edit-operaciones-intervencion-modal/edit-operaciones-intervencion-modal.component'; 
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { interval, of, Subscription } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { consultabcv } from 'app/models/consultas';

@Component({
  selector: 'app-consultabcv-intervencion',
  templateUrl: './consultabcv-intervencion.component.html',
  styleUrls: ['./consultabcv-intervencion.component.scss'],
})
export class ConsultabcvIntervencionComponent implements OnInit {
 //#region Variables

  /** Formulario reactivo para los criterios de búsqueda */
  consultaForm: FormGroup;
  /** Índice de la pestaña seleccionada */
  selectedTabIndex = 0; 
  /** Variables auxiliares para los filtros */
  fechOper: string = '';

  /** Estado de carga para mostrar el loading bar */
  isLoading: boolean = false;

  /** Fecha máxima permitida en el calendario (hoy) */
  today = new Date();
  /** Permite ver la pestaña de operaciones */
  canViewTab: boolean = true;


   exportProgress = 0;
  showExportProgress = false;

  //#region  tablas

  /** Columnas a mostrar en la tabla de operaciones */
  displayedColumns: string[] = [
    'nuVenta', 'fechaRegistro', 'estatusArchivo', 'observacion', 'download'
  ];
  /** Opciones de posición para tooltips */
  positionOptions: TooltipPosition[] = ['below'];
  position = new FormControl(this.positionOptions[0]);

  /** Fuente de datos para la tabla de operaciones */
  dataSourceH: MatTableDataSource<consultabcv>;
  /** Fuente de datos auxiliar (no usada en este contexto) */
  consulta: MatTableDataSource<consultabcv>;


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
    this.dataSourceH = new MatTableDataSource(); 
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
      this.dataSourceH = new MatTableDataSource([]);

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
  // Siempre inicializa el formulario vacío
  this.consultaForm = this._formBuilder.group({
    fechOper: [this.today, [Validators.required]],
  });

  // Si hay datos guardados, los carga en el formulario
  const savedBusqueda = localStorage.getItem('consultaBCVIntervencion');
  if (savedBusqueda) {
    const busqueda = JSON.parse(savedBusqueda);
    this.consultaForm.patchValue({
      fechOper: busqueda.fechOper
    });
  }
  // --- DATOS DE PRUEBA ---
  // const datosPrueba: consultabcv[] = [
  //   {
  //     nuVenta: "VENTA20250519AAQ9P0X",
  //     fechaRegistro: "19/05/2025 13:05:19",
  //     estatusArchivo: "Procesado",
  //     observacion: ""
  //   },
  //   {
  //     nuVenta: "VENTA20250519KYXVH8Z",
  //     fechaRegistro: "19/05/2025 12:47:40",
  //     estatusArchivo: "Rechazado por error",
  //     observacion: ""

  //   },
  //   {
  //     nuVenta: "VENTA20250519ZVM1D5X",
  //     fechaRegistro: "19/05/2025 12:37:08",
  //     estatusArchivo: "Rechazado por error",
  //     observacion: ""

  //   },
  //   {
  //     nuVenta: "VENTA20250519PBGRDHS",
  //     fechaRegistro: "19/05/2025 12:30:35",
  //     estatusArchivo: "Devuelto por transmisión posterior",
  //     observacion: ""
  //   },
  //   {
  //     nuVenta: "VENTA20250519J7DMNRF",
  //     fechaRegistro: "19/05/2025 12:29:58",
  //     estatusArchivo: "Rechazado por error",
  //     observacion: "Failed to validate json data"
  //   }
  // ];
  // this.dataSourceH = new MatTableDataSource(datosPrueba);
}

  /**
   * Consulta las operaciones de intervención según los filtros seleccionados.
   * Guarda los resultados y filtros en localStorage.
   */
  consultarBCVIntervencion() {
    this.isLoading = true;
    const form = this.consultaForm.value;

    if (this.consultaForm.controls['fechOper'].invalid) {
      this._snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar']
      });
      this.isLoading = false;
      return;
    }
    
      this.selectedTabIndex = 1;
    // this._service.consultaBCVIntervencion(form.fechOper).subscribe(
    //   (resp: consultabcv[]) => {
    //     this.dataSourceH = new MatTableDataSource(resp);
    //     this.dataSourceH.paginator = this.paginator;
    //     this.dataSourceH.sort = this.sortH;
    //     this.selectedTabIndex = 1;
    //     this.canViewTab = true;

    //     // Guarda los criterios y resultados después de consultar
    //     localStorage.setItem('consultaBCVIntervencionBusqueda', JSON.stringify(form));
    //     localStorage.setItem('consultaBCVIntervencionResultados', JSON.stringify(resp));
    //     this.isLoading = false;
    //   },
    //   (err) => {
    //     console.error("Error", err);
    //     alert('Ocurrió un error inesperado, por favor vuelve a intentarlo');
    //     this.isLoading = false;
    //   }
    // );
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
    this._service.exportarConstultaBcv('intervencionFiltroExportar', this.consultaForm.value)
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
    this.consultaForm.reset();
    // Asigna la fecha del día nuevamente
    const today = new Date();
    this.consultaForm.get('fechOper')?.setValue(today);

    this.dataSourceH.data = [];
    this.isLoading = false;

  }


}