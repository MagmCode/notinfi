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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ExportProgressService } from 'app/services/export-progress.service';


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
  canViewTab: boolean = false;


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
    private exportProgressService: ExportProgressService
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
  // Inicializa el formulario con la fecha de hoy
  this.consultaForm = this._formBuilder.group({
    fechOper: [this.today, [Validators.required]],
  });

  // Limpia el tab guardado al entrar
  localStorage.removeItem('consultaBCVIntervencionTab');


  // Verifica si hay datos guardados
  const savedBusqueda = localStorage.getItem('consultaBCVIntervencion');
  const savedResultados = localStorage.getItem('consultaBCVIntervencionResultados');
  const savedTab = localStorage.getItem('consultaBCVIntervencionTab');

  if (savedBusqueda && savedResultados && savedTab === '1') {
    // Si estaba en el tab 1, restaura fecha y resultados
    const busqueda = JSON.parse(savedBusqueda);
    const resultados = JSON.parse(savedResultados);
    this.consultaForm.patchValue({ fechOper: busqueda.fechOper });
    this.dataSourceH.data = resultados;
    this.selectedTabIndex = 1;
    this.canViewTab = true;
  } else {
    // Si no, limpia todo y pone la fecha de hoy
    this.consultaForm.patchValue({ fechOper: this.today });
    this.dataSourceH.data = [];
    this.selectedTabIndex = 0;
    this.canViewTab = false;
  }
}

  /**
   * Consulta las operaciones de intervención según los filtros seleccionados.
   * Guarda los resultados y filtros en localStorage.
   */
consultarBCVIntervencion() {
  if (this.consultaForm.invalid) {
    this._snackBar.open("Debe seleccionar una fecha válida.", "Cerrar", {
      duration: 3000,
      horizontalPosition: "center",
      verticalPosition: "bottom",
      panelClass: ["custom-snackbar"],
    });
    return;
  }

  this.isLoading = true;
  const fechaFiltro = this.formatearFechaFiltro(
    this.consultaForm.value.fechOper
  );

  this._service.consultaBCVIntervencion({ fechaFiltro }).subscribe({
    next: (data) => {
      this.dataSourceH.data = data || [];
      this.selectedTabIndex = 1;
      this.canViewTab = true;
      localStorage.setItem(
        "consultaBCVIntervencion",
        JSON.stringify({ fechOper: this.consultaForm.value.fechOper })
      );
      localStorage.setItem(
        "consultaBCVIntervencionResultados",
        JSON.stringify(data || [])
      );
      localStorage.setItem("consultaBCVIntervencionTab", "1");
      this.isLoading = false;

      console.log("Tipo de data:", typeof data, Array.isArray(data), data);
      this.dataSourceH.data = data || [];
      this.selectedTabIndex = 1;
      this.canViewTab = true;
      localStorage.setItem(
        "consultaBCVIntervencion",
        JSON.stringify({ fechOper: this.consultaForm.value.fechOper })
      );
      this.isLoading = false;
    },
    error: (err) => {
      console.error("Error en consultaBCVIntervencion:", err);

      this.isLoading = false;
      this.dataSourceH.data = [];
      this.selectedTabIndex = 1; // Siempre muestra la pestaña de resultados
      this.canViewTab = true;

      // Guarda el filtro y resultados vacíos en localStorage
      localStorage.setItem(
        "consultaBCVIntervencion",
        JSON.stringify({ fechOper: this.consultaForm.value.fechOper })
      );
      localStorage.setItem(
        "consultaBCVIntervencionResultados",
        JSON.stringify([])
      );
      localStorage.setItem("consultaBCVIntervencionTab", "1");
    },
  });
}
  /**
   * Exporta los resultados de la consulta a un archivo Excel.
   */
 exportarExcel(): void {
  const fechaFiltro = this.formatearFechaFiltro(this.consultaForm.value.fechOper);
  this.exportProgressService.iniciarProgreso((blob: Blob, fileName: string) => {
    this.exportProgressService.descargarArchivo(blob, fileName);
    this._snackBar.open("Archivo listo. La descarga comenzará en breve.", "Cerrar", {
      duration: 4000
    });
  },
  () => this._service.exportarConstultaBcv({ fechaFiltro })
  );
 }

 archivoBcv(nuVenta: string):void {
   console.log('Descargando archivo para nuVenta:', nuVenta);
  this.exportProgressService.iniciarProgreso((blob: Blob, fileName: string) => {
    this.exportProgressService.descargarArchivo(blob, fileName);
    this._snackBar.open("Archivo listo. La descarga comenzará en breve.", "Cerrar", {
      duration: 4000
    });
  },
  () => this._service.descargaArchivoBcv({nuVenta})
  );
}


private formatearFechaFiltro(date: any): string {
  // Depuración
  console.log('Valor recibido en formatearFechaFiltro:', date);

  let d: Date | null = null;

  // Si es un objeto Moment.js
  if (date && typeof date === 'object' && date._isAMomentObject) {
    d = date.toDate();
  } else if (date instanceof Date) {
    d = date;
  } else if (typeof date === 'string') {
    // Si viene en formato ISO (ej: "2025-05-19T00:00:00.000Z")
    if (/^\d{4}-\d{2}-\d{2}/.test(date)) {
      d = new Date(date);
    }
    // Si viene en formato "dd/MM/yyyy"
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [day, month, year] = date.split('/').map(Number);
      d = new Date(year, month - 1, day);
    }
    // Si viene en formato "yyyyMMdd"
    else if (/^\d{8}$/.test(date)) {
      const year = Number(date.substring(0, 4));
      const month = Number(date.substring(4, 6));
      const day = Number(date.substring(6, 8));
      d = new Date(year, month - 1, day);
    }
    // Si viene en formato "yyyy-MM-dd"
    else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      const [year, month, day] = date.split('-').map(Number);
      d = new Date(year, month - 1, day);
    }
    else {
      // Intenta parsear cualquier otro formato
      d = new Date(date);
    }
  }

  if (!d || isNaN(d.getTime())) {
    throw new Error('Fecha inválida');
  }

  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
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