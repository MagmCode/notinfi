/**
 * Componente para la gestión y consulta de operaciones de pacto directo.
 * Permite filtrar operaciones por criterios, visualizar resultados, exportar, editar y procesar registros.
 * Incluye manejo de paginación, selección múltiple y persistencia de filtros/resultados en localStorage.
 */
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Interbancaria } from 'app/models/mesa-cambio';
import { ServiceService } from 'app/services/service.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections'; 
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ExportProgressService } from 'app/services/export-progress.service';


@Component({
  selector: 'app-consulta-interbancaria-mesa-cambio',
  templateUrl: './consulta-interbancaria-mesa-cambio.component.html',
  styleUrls: ['./consulta-interbancaria-mesa-cambio.component.scss']
})
export class ConsultaInterbancariaMesaCambioComponent implements OnInit,  AfterViewInit, OnDestroy {
  selectedRow: any;
  /** Diccionario para mostrar nombres personalizados en los encabezados de la tabla */
  columnNames: { [key: string]: string } = {
    'ID': 'ID Operación',
    'TIPO_OPER': 'Tipo Operación',
    'TIPO_CLIENTE': 'Tipo Cliente',
    'RIF_CLIENTE': 'RIF',
    'NOMBRE_CLIENTE': 'Nombre',
    'CODIGO_MONEDA': 'Moneda',
    'MONTO': 'Monto',
    'TASA_CAMBIO': 'Tasa',
    'FECHA': 'Fecha',
    'CODIGO_INSTITUCION': 'Institución',
    'ID_JORNADA': 'Jornada',
    'CUENTA_ME': 'Cuenta ME',
    'CUENTA_MN': 'Cuenta MN',
    'ESTATUS': 'Estatus',
    'OBSERVACION': 'Observación',
    'ID_BCV': 'ID BCV',
    'select': '',
  };
//#region Variables

  /** Formulario reactivo para los criterios de búsqueda */
  operaPactoForm: FormGroup;
  /** Índice de la pestaña seleccionada */
  selectedTabIndex = 0; 
  /** Mensaje de error para archivos */
  fileErrorInter: string = '';
  /** Variables auxiliares para los filtros */
  movimiento: string = '';
  nroCedRif: string = '';
  nacionalidad: string = '';
  envioBCV: string = '';
  tipoMesa: string = '';
  fechOper: string = '';
  /** Resumen de cantidad de operaciones */
  cantidad: string = '';
  /** Resumen de monto total */
  total: string = '';
  /** Jornada actual (string) */
  jornada: string = '';
  /** Estatus actual (string) */
  estatus: string = '';

  /** IDs seleccionados en la tabla */
  selectedIds: Set<any> = new Set<any>();

  // jornadaSeleccionada: any = null;


  /** Estado de carga para mostrar el loading bar */
  isLoading: boolean = false;

  /** Modelo de selección múltiple para la tabla */
  selection = new SelectionModel<Interbancaria>(true, []);

  /** Fecha máxima permitida en el calendario (hoy) */
  today = new Date();
  /** Permite ver la pestaña de operaciones */
  canViewTab: boolean = false;


   exportProgress = 0;
  showExportProgress = false;

  //#region  tablas


  /** Columnas para modo detalle */
  displayedColumns: string[] = [
    'select', 'ID', 'TIPO_OPER',  'TIPO_CLIENTE', 'RIF_CLIENTE', 'NOMBRE_CLIENTE', 'CODIGO_MONEDA', 'MONTO', 'TASA_CAMBIO', 'FECHA',
    'CODIGO_INSTITUCION', 'ID_JORNADA', 'CUENTA_ME', 'CUENTA_MN', 'ESTATUS', 'OBSERVACION', 'ID_BCV'
  ];



  /** Opciones de posición para tooltips */
  positionOptions: TooltipPosition[] = ['below'];
  position = new FormControl(this.positionOptions[0]);

  /** Fuente de datos para la tabla de operaciones */
  dataSourceH: MatTableDataSource<Interbancaria>;
  interbancaria: Interbancaria[] = [
    {
      ID: 1,
      TIPO_OPER: 'C',
      RIF_CLIENTE: 1234567890,
      NOMBRE_CLIENTE: 'Banco Provincial',
      CODIGO_MONEDA: 'USD',
      MONTO: 10000.50,
      TASA_CAMBIO: 5.12,
      FECHA: '11/09/2025 09:00:00',
      CODIGO_INSTITUCION: '0001',
      ID_JORNADA: 'JRN-001',
      CUENTA_ME: '0102-1234567890',
      CUENTA_MN: '0102-0987654321',
      TIPO_INSTRUMENTO: 'BOND',
      OBSERVACION: 'Sin observaciones',
      ESTATUS: 'A',
      ID_BCV: 'BCV-001',
      TIPO_CLIENTE: 'N',
    },
    {
      ID: 2,
      TIPO_OPER: 'V',
      RIF_CLIENTE: 9876543210,
      NOMBRE_CLIENTE: 'Banco Mercantil',
      CODIGO_MONEDA: 'EUR',
      MONTO: 5000.75,
      TASA_CAMBIO: 5.20,
      FECHA: '11/09/2025 10:30:00',
      CODIGO_INSTITUCION: '0002',
      ID_JORNADA: 'JRN-002',
      CUENTA_ME: '0102-2233445566',
      CUENTA_MN: '0102-6655443322',
      TIPO_INSTRUMENTO: 'ACC',
      OBSERVACION: 'Pendiente de revisión',
      ESTATUS: 'P',
      ID_BCV: 'BCV-002',
      TIPO_CLIENTE: 'J',
    }
  ];

  /** Referencia al componente de ordenamiento de Angular Material */
  @ViewChild(MatSort) sortH: MatSort = new MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('editDialog') editDialogTemplate: TemplateRef<any>;

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
    this.dataSourceH = new MatTableDataSource(this.interbancaria); 
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
      localStorage.removeItem('operacionespactoDirectoBusqueda');
      localStorage.removeItem('operacionespactoDirectoResultados');
      localStorage.removeItem('operacionespactoDirectoCantidad');
      localStorage.removeItem('operacionespactoDirectoTotal');
      localStorage.removeItem('operacionespactoDirectoJornada');
      this.dataSourceH = new MatTableDataSource([]);
  this.interbancaria = [];
      this.cantidad = '';
      this.total = '';
      this.jornada = '';
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
    const savedBusqueda = localStorage.getItem('operacionespactoDirectoBusqueda');
    if (savedBusqueda) {
      const busqueda = JSON.parse(savedBusqueda);
      this.operaPactoForm = this._formBuilder.group({
        nroCedRif: [busqueda.nroCedRif],
        nacionalidad: [busqueda.nacionalidad],
        estatus: [busqueda.estatus],
        codDivisas: [busqueda.codDivisas],
        fechOper: [busqueda.fechOper, [Validators.required]],
      });

      // Recupera los resultados guardados
      const savedResultados = localStorage.getItem('operacionespactoDirectoResultados');
      if (savedResultados) {
        const resultados = JSON.parse(savedResultados);
        const safeResultados = Array.isArray(resultados) ? resultados : [];
        this.dataSourceH = new MatTableDataSource(safeResultados);
  this.interbancaria = safeResultados;
        this.selectedTabIndex = 1;
        this.canViewTab = true;
      } else {
        this.dataSourceH = new MatTableDataSource([]);
        this.canViewTab = false;
      }

      // Recupera cantidad, total y jornada
      const savedCantidad = localStorage.getItem('operacionespactoDirectoCantidad');
      if (savedCantidad) {
        this.cantidad = JSON.parse(savedCantidad);
      }
      const savedTotal = localStorage.getItem('operacionespactoDirectoTotal');
      if (savedTotal) {
        this.total = JSON.parse(savedTotal);
      }
      const savedJornada = localStorage.getItem('operacionespactoDirectoJornada');
      if (savedJornada) {
        this.jornada = JSON.parse(savedJornada);
      }
    } else {
      const today = new Date();
      this.operaPactoForm = this._formBuilder.group({
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
  consultarPactoDirecto() {
    this.isLoading = true;
    if (this.operaPactoForm.controls['fechOper'].invalid) {
      this._snackBar.open('Por favor, completa todos los campos requeridos', 'Cerrar', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar']
      });
      this.isLoading = false;
      return;
    }
    // Mostrar solo los datos estáticos
    this.dataSourceH = new MatTableDataSource(this.interbancaria);
    this.dataSourceH.paginator = this.paginator;
    this.dataSourceH.sort = this.sortH;
    this.selectedTabIndex = 1;
    this.canViewTab = true;
    this.cantidad = this.interbancaria.length.toString();
    this.total = this.interbancaria.reduce((acc, curr) => acc + (curr.MONTO || 0), 0).toString();
    this.jornada = 'MS561166';
    this.estatus = 'precierre';
    this.isLoading = false;
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
  this.selectedIds = new Set(this.dataSourceH.data.map(row => row.ID));
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
    // const codigoJornada = this.jornadaSeleccionada?.codigo
    const payload = {
      ids: selectedIdsArray,
      // codigoJornada: codigoJornada
    }
    console.log('IDs seleccionados:', selectedIdsArray);
    // console.log('Código de jornada seleccionada:', codigoJornada);
  }
  
  /**
   * Maneja el cambio de selección de un checkbox individual.
   * @param event Evento del checkbox.
   * @param row Fila correspondiente.
   */
  onCheckboxChange(event: MatCheckboxChange, row: Interbancaria) {
    if (event.checked) {
      this.selection.select(row);
      this.selectedIds.add(row.ID);
    } else {
      this.selection.deselect(row);
      this.selectedIds.delete(row.ID);
    }
    this.obtenerIdsSeleccionados();
  }
  
  /**
   * Procesa las filas seleccionadas (ejemplo: muestra un alert con los IDs).
   */
processSelectedRows() {
  const selectedIdsArray = Array.from(this.selectedIds);
  // const codigoJornada = this.jornadaSeleccionada?.codigo;

  if (!selectedIdsArray.length) {
    this._snackBar.open('Debe seleccionar una jornada y al menos una operación.', 'Cerrar', { duration: 3000 });
    return;
  }
  if (!selectedIdsArray.length) {
    this._snackBar.open('Debe seleccionar las operaciones a procesar.', 'Cerrar', { duration: 3000 });
    return;
  }

  // Detectar si todas las filas están seleccionadas
  const todasSeleccionadas = this.dataSourceH.data.length > 0 && selectedIdsArray.length === this.dataSourceH.data.length;

  let payload: any;
  if (todasSeleccionadas) {
    payload = { todos: true };
  } else {
    // Filtrar operaciones seleccionadas
  const operacionesSeleccionadas = this.dataSourceH.data.filter(row => selectedIdsArray.includes(row.ID));
    // Filtrar operaciones ya cerradas (estatus numérico: 2)
  // No existe STATUS_ENVIO, usar ESTATUS: 'A'=Abierto, 'P'=Pendiente, 'C'=Cerrado, 'N'=Anulado
  const yaCerradas = operacionesSeleccionadas.filter(op => op.ESTATUS === 'C' || op.ESTATUS === 'N');
  const idsValidos = operacionesSeleccionadas.filter(op => op.ESTATUS !== 'C' && op.ESTATUS !== 'N').map(op => op.ID);

    if (yaCerradas.length === selectedIdsArray.length) {
      this._snackBar.open('No hay operaciones válidas para procesar (todas ya están en "lote cerrado").', 'Cerrar', { duration: 4000 });
      return;
    }
    if (yaCerradas.length > 0) {
      this._snackBar.open(
  `Algunas operaciones ya están en "lote cerrado" o "anulada" y serán omitidas: ${yaCerradas.map(op => op.ID).join(', ')}`,
        'Cerrar',
        { duration: 5000 }
      );
    }

    payload = { ids: idsValidos };
  }

  // Log para ver cómo le llega al backend
  console.log('Payload enviado al backend:', payload);

  // Llama al servicio y muestra el mensaje solo si responde correctamente
  this._service.procesarOperaciones(payload).subscribe({
    next: (resp) => {
      this._snackBar.open('Operaciones enviadas con éxito.', 'Cerrar', { duration: 4000 });
      // Aquí puedes actualizar la tabla si lo necesitas
    },
    error: () => {
      this._snackBar.open('Error al enviar las operaciones.', 'Cerrar', { duration: 4000 });
    }
  });
}

cerrarLote() {
  const selectedIdsArray = Array.from(this.selectedIds);

  // Obtén la fecha del formulario y formateala
  const formFecha = this.operaPactoForm.get('fechOper')?.value;
  const fechOper = formFecha ? this.formatFecha(formFecha) : undefined;

  if (!selectedIdsArray.length) {
    this._snackBar.open('Debe seleccionar las operaciones a las que desea cambiar el status.', 'Cerrar', { duration: 3000 });
    return;
  }

  // Detectar si todas las filas están seleccionadas
  const todasSeleccionadas = this.dataSourceH.data.length > 0 && selectedIdsArray.length === this.dataSourceH.data.length;

  let idsValidos: any[] = [];
  if (todasSeleccionadas) {
    // Enviar todos los ids cuyo estatus no sea 2 ni 3
    idsValidos = this.dataSourceH.data
  .filter(row => row.ESTATUS !== 'C' && row.ESTATUS !== 'N')
  .map(row => row.ID);
  } else {
    // Solo los seleccionados y que no sean 2 ni 3
  const operacionesSeleccionadas = this.dataSourceH.data.filter(row => selectedIdsArray.includes(row.ID));
    idsValidos = operacionesSeleccionadas
  .filter(op => op.ESTATUS !== 'C' && op.ESTATUS !== 'N')
  .map(op => op.ID);

  const yaCerradasOAnuladas = operacionesSeleccionadas.filter(op => op.ESTATUS === 'C' || op.ESTATUS === 'N');
    if (yaCerradasOAnuladas.length === selectedIdsArray.length) {
      this._snackBar.open('No hay operaciones válidas para procesar (todas ya están en "lote cerrado" o "anulada").', 'Cerrar', { duration: 4000 });
      return;
    }
    if (yaCerradasOAnuladas.length > 0) {
      this._snackBar.open(
  `Algunas operaciones ya están en "lote cerrado" o "anulada" y serán omitidas: ${yaCerradasOAnuladas.map(op => op.ID).join(', ')}`,
        'Cerrar',
        { duration: 5000 }
      );
    }
  }

  const payload = {
    idsOper: idsValidos,
    fechOper: fechOper
  };

  console.log('Payload enviado al backend:', payload);

  this._service.cerrarLotesOperaciones(payload).subscribe({
    next: (resp) => {
      this._snackBar.open('Operaciones procesadas correctamente.', 'Cerrar', { duration: 3000 });
      // Actualiza la tabla si es necesario
    },
    error: () => {
      this._snackBar.open('Error al procesar las operaciones.', 'Cerrar', { duration: 3000 });
    }
  });
}

private formatFecha(fecha: Date | string): string {
  const date = new Date(fecha);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

exportarExcel(): void {

    this.exportProgressService.iniciarProgreso(
      (blob: Blob, fileName: string) => {
        this.exportProgressService.descargarArchivo(blob, fileName);
        this._snackBar.open('Archivo listo. La descarga comenzará en breve.', 'Cerrar', { duration: 4000 });
      },
      () =>  this._service.exportarIntervencion('pactoDirectoFiltroExportar', this.operaPactoForm.value)
    );
}

applyFilterH(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceH.filter = filterValue.trim().toLowerCase();

  if (this.dataSourceH.paginator) {
    this.dataSourceH.paginator.firstPage();
  }
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
    this.operaPactoForm.reset();
    // Asigna la fecha del día nuevamente
    const today = new Date();
    this.operaPactoForm.get('fechOper')?.setValue(today);

    this.dataSourceH.data = [];
    this.isLoading = false;
    this.selectedIds.clear();
    this.selection.clear();
    this.fileErrorInter = '';
    // Limpia localStorage al regresar a búsqueda
    localStorage.removeItem('operacionespactoDirectoBusqueda');
    localStorage.removeItem('operacionespactoDirectoResultados');
    localStorage.removeItem('operacionespactoDirectoCantidad');
    localStorage.removeItem('operacionespactoDirectoTotal');
    localStorage.removeItem('operacionespactoDirectoJornada');
    this.cantidad = '';
    this.total = '';
    this.jornada = '';
  }

  
  /**
   * Limpia el localStorage al destruir el componente.
   */
  ngOnDestroy(): void {
    localStorage.removeItem('operacionespactoDirectoBusqueda');
    localStorage.removeItem('operacionespactoDirectoResultados');
    localStorage.removeItem('operacionespactoDirectoCantidad');
    localStorage.removeItem('operacionespactoDirectoTotal');
    localStorage.removeItem('operacionespactoDirectoJornada');
  }
}