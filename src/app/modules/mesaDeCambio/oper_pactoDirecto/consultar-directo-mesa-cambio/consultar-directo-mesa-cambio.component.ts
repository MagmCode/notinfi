/**
 * Componente para la gestión y consulta de operaciones de pacto directo.
 * Permite filtrar operaciones por criterios, visualizar resultados, exportar, editar y procesar registros.
 * Incluye manejo de paginación, selección múltiple y persistencia de filtros/resultados en localStorage.
 */
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { pactoDirecto, respuestaPactoDireco } from 'app/models/mesa-cambio';
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
  selector: 'app-consultar-directo-mesa-cambio',
  templateUrl: './consultar-directo-mesa-cambio.component.html',
  styleUrls: ['./consultar-directo-mesa-cambio.component.scss']
})
export class ConsultarDirectoMesaCambioComponent implements OnInit, AfterViewInit, OnDestroy {
  editForm: FormGroup;
  selectedRow: any;
  /** Diccionario para mostrar nombres personalizados en los encabezados de la tabla */
  columnNames: { [key: string]: string } = {
    'ID_OPER': 'ID Oper',
    'ID_OC': 'ID OC',
    'TIPO_PACTO': 'Tipo Pacto',
    'TIPO_INSTRUM': 'Instrumento',
    'MTO_DIVISAS': 'Monto Divisas',
    'MTO_BOLIVARES': 'Monto Bolívares',
    'TASA_CAMBIO': 'Tasa Cambio',
    'MTO_COMI': 'Monto Comisión',
    'TIPO_PER_OFER': 'Tipo Operación Ofer',
    'CED_RIF_OFER': 'Ced-Rif Ofer',
    'NOM_OFER': 'Nombre Ofer',
    'CTA_OFER_MN': 'Cuenta Ofer MN',
    'CTA_OFER_ME': 'Cuenta Ofer ME',
    'TIPO_PER_DEMA': 'Tipo Operación Dema',
    'CED_RIF_DEMA': 'Ced-Rif Dema',
    'NOM_DEMA': 'Nombre Dema',
    'CTA_DEMA_MN': 'Cuenta Dema MN',
    'CTA_DEMA_ME': 'Cuenta Dema ME',
    'MTO_CONTRAVALOR_USD': 'Contra Valor USD',
    'MTO_CONTRAVALORBASE': 'Contra Valor Bs',
    'TASA_PACTOBASE': 'Tasa Base',
    'FECH_OPER': 'Fecha Operación',
    'COD_DIVISAS': 'Código Divisas',
    'STATUS_ENVIO': 'Estatus',
    'COD_FINSTITUCION': 'Código Oficina',
    'OBSERVACION': 'Observación',
    'ID_BCV': 'ID BCV',
    'edit': 'Editar',
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
  selection = new SelectionModel<pactoDirecto>(true, []);

  /** Fecha máxima permitida en el calendario (hoy) */
  today = new Date();
  /** Permite ver la pestaña de operaciones */
  canViewTab: boolean = false;


   exportProgress = 0;
  showExportProgress = false;

  //#region  tablas

  /** Controla si se muestran los detalles en la tabla */
  mostrarDetalle: boolean = false;

  /** Columnas para modo simple */
  displayedColumnsSimple: string[] = [
    'select', 'ID_OPER', 'ID_OC', 'TIPO_PACTO', 'TIPO_INSTRUM', 'MTO_DIVISAS', 'MTO_BOLIVARES', 'TASA_CAMBIO',
    'TIPO_PER_OFER', 'CED_RIF_OFER', 'NOM_OFER', 'CTA_OFER_MN', 'CTA_OFER_ME', 'FECH_OPER', 'COD_DIVISAS',
    'STATUS_ENVIO', 'COD_FINSTITUCION', 'ID_BCV', 'edit'
  ];

  /** Columnas para modo detalle */
  displayedColumnsDetalle: string[] = [
    'select', 'ID_OPER', 'ID_OC', 'TIPO_PACTO', 'TIPO_INSTRUM', 'MTO_DIVISAS', 'MTO_BOLIVARES', 'TASA_CAMBIO', 'MTO_COMI',
    'TIPO_PER_OFER', 'CED_RIF_OFER', 'NOM_OFER', 'CTA_OFER_MN', 'CTA_OFER_ME', 'TIPO_PER_DEMA', 'CED_RIF_DEMA', 'NOM_DEMA',
    'CTA_DEMA_MN', 'CTA_DEMA_ME', 'MTO_CONTRAVALOR_USD', 'MTO_CONTRAVALORBASE', 'TASA_PACTOBASE', 'FECH_OPER', 'COD_DIVISAS',
    'STATUS_ENVIO', 'COD_FINSTITUCION', 'OBSERVACION', 'ID_BCV', 'edit'
  ];

  /** Columnas a mostrar en la tabla de operaciones (dinámico) */
  get displayedColumns(): string[] {
    return this.mostrarDetalle ? this.displayedColumnsDetalle : this.displayedColumnsSimple;
  }
  /** Alterna entre mostrar y ocultar detalle */
  toggleDetalle(): void {
    this.mostrarDetalle = !this.mostrarDetalle;
  }
  /** Opciones de posición para tooltips */
  positionOptions: TooltipPosition[] = ['below'];
  position = new FormControl(this.positionOptions[0]);

  /** Fuente de datos para la tabla de operaciones */
  dataSourceH: MatTableDataSource<pactoDirecto>;
  /** Fuente de datos auxiliar (no usada en este contexto) */
  operaPactoDirecto: MatTableDataSource<pactoDirecto>;
  /** Lista de operaciones de Pacto Directo */
  pactoDirecto: any[] = [
    {
      ID_OPER: '1001',
      ID_OC: 'OC-001',
      TIPO_PACTO: 'Compra',
      TIPO_INSTRUM: 'Bonos',
      MTO_DIVISAS: 5000,
      MTO_BOLIVARES: 25000,
      TASA_CAMBIO: 5.0,
      MTO_COMI: 100,
      TIPO_PER_OFER: 'Natural',
      CED_RIF_OFER: 'V12345678',
      NOM_OFER: 'Juan Perez',
      CTA_OFER_MN: '0102-1234567890',
      CTA_OFER_ME: '0102-0987654321',
      TIPO_PER_DEMA: 'Juridico',
      CED_RIF_DEMA: 'J87654321',
      NOM_DEMA: 'Empresa XYZ',
      CTA_DEMA_MN: '0102-1122334455',
      CTA_DEMA_ME: '0102-5544332211',
      MTO_CONTRAVALOR_USD: 1000,
      MTO_CONTRAVALORBASE: 5000,
      TASA_PACTOBASE: 4.8,
      FECH_OPER: '09/09/2025',
      COD_DIVISAS: 'USD',
      STATUS_ENVIO: 0,
      COD_FINSTITUCION: '001',
      OBSERVACION: 'Sin observaciones',
      ID_BCV: 'BCV-001',
    },
    {
      ID_OPER: '1002',
      ID_OC: 'OC-002',
      TIPO_PACTO: 'Venta',
      TIPO_INSTRUM: 'Acciones',
      MTO_DIVISAS: 3000,
      MTO_BOLIVARES: 15000,
      TASA_CAMBIO: 5.1,
      MTO_COMI: 80,
      TIPO_PER_OFER: 'Juridico',
      CED_RIF_OFER: 'J12345678',
      NOM_OFER: 'Empresa ABC',
      CTA_OFER_MN: '0102-2233445566',
      CTA_OFER_ME: '0102-6655443322',
      TIPO_PER_DEMA: 'Natural',
      CED_RIF_DEMA: 'V87654321',
      NOM_DEMA: 'Maria Gomez',
      CTA_DEMA_MN: '0102-3344556677',
      CTA_DEMA_ME: '0102-7766554433',
      MTO_CONTRAVALOR_USD: 600,
      MTO_CONTRAVALORBASE: 3000,
      TASA_PACTOBASE: 5.0,
      FECH_OPER: '09/09/2025',
      COD_DIVISAS: 'EUR',
      STATUS_ENVIO: 1,
      COD_FINSTITUCION: '002',
      OBSERVACION: 'Pendiente de revisión',
      ID_BCV: 'BCV-002',
    }
  ];

  /** Referencia al componente de ordenamiento de Angular Material */
  @ViewChild(MatSort) sortH: MatSort = new MatSort;
  /** Referencia al paginador de Angular Material */
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
    this.dataSourceH = new MatTableDataSource(this.pactoDirecto); 
  }

  /**
   * Abre el diálogo de edición para una operación seleccionada.
   * @param row Fila de la operación a editar.
   */
  openEditDialog(row: any): void {
    this.selectedRow = row;
    this.editForm = this._formBuilder.group({
      ID_OPER: [{ value: row.ID_OPER, disabled: true }],
      MTO_DIVISAS: [row.MTO_DIVISAS, Validators.required],
      MTO_CONTRAVALOR_USD: [row.MTO_CONTRAVALOR_USD, Validators.required],
      TASA_CAMBIO: [row.TASA_CAMBIO, Validators.required],
      TIPO_PER_OFER: [row.TIPO_PER_OFER, Validators.required],
      CED_RIF_OFER: [row.CED_RIF_OFER, Validators.required],
      NOM_OFER: [row.NOM_OFER, Validators.required],
      CTA_OFER_MN: [row.CTA_OFER_MN, Validators.required],
      CTA_OFER_ME: [row.CTA_OFER_ME, Validators.required],
      TIPO_PER_DEMA: [row.TIPO_PER_DEMA, Validators.required],
      CED_RIF_DEMA: [row.CED_RIF_DEMA, Validators.required],
      NOM_DEMA: [row.NOM_DEMA, Validators.required],
      CTA_DEMA_MN: [row.CTA_DEMA_MN, Validators.required],
      CTA_DEMA_ME: [row.CTA_DEMA_ME, Validators.required],
      COD_DIVISAS: [row.COD_DIVISAS, Validators.required],
      TIPO_PACTO: [row.TIPO_PACTO, Validators.required],
    });
    this.dialog.open(this.editDialogTemplate, {
      width: '770px',
      data: row
    });
  }

  closeEditDialog(): void {
    this.dialog.closeAll();
  }

  saveEditDialog(): void {
    if (this.editForm.valid) {
      // Aquí puedes actualizar los datos en la tabla/pactoDirecto
      const updated = { ...this.selectedRow, ...this.editForm.getRawValue() };
      // Actualiza el array pactoDirecto
      const idx = this.pactoDirecto.findIndex(item => item.ID_OPER === updated.ID_OPER);
      if (idx > -1) {
        this.pactoDirecto[idx] = updated;
        this.dataSourceH.data = [...this.pactoDirecto];
      }
      this.dialog.closeAll();
      this._snackBar.open('Operación actualizada correctamente.', 'Cerrar', { duration: 3000 });
    }
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
      this.pactoDirecto = [];
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
        this.pactoDirecto = safeResultados;
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
    // Solo la fecha es requerida
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
    this.dataSourceH = new MatTableDataSource(this.pactoDirecto);
    this.dataSourceH.paginator = this.paginator;
    this.dataSourceH.sort = this.sortH;
    this.selectedTabIndex = 1;
    this.canViewTab = true;
    this.cantidad = this.pactoDirecto.length.toString();
    this.total = this.pactoDirecto.reduce((acc, curr) => acc + (curr.MTO_DIVISAS || 0), 0).toString();
    this.jornada = 'MS561166';
    this.estatus = 'precierre';
    this.isLoading = false;

    // Suscripción al servicio comentada para uso futuro
    /*
    this._service.consultapactoDirecto('pactoDirectoFiltro',form).subscribe({
      next: (resp: respuestapactoDirecto) => {
        console.log("formulario enviado:", form);
        this.pactoDirecto = resp.resppactoDirecto;
        this.dataSourceH = new MatTableDataSource(this.pactoDirecto);
        this.dataSourceH.paginator = this.paginator;
        this.dataSourceH.sort = this.sortH;
        this.selectedTabIndex = 1;
        this.canViewTab = true;
        this.cantidad = resp.cantidad;
        this.total = resp.totales;
        this.jornada = resp.jornadasList;
        // Guarda los criterios y resultados después de consultar
        localStorage.setItem('operacionespactoDirectoBusqueda', JSON.stringify(form));
        localStorage.setItem('operacionespactoDirectoResultados', JSON.stringify(this.pactoDirecto));
        localStorage.setItem('operacionespactoDirectoCantidad', JSON.stringify(this.cantidad));
        localStorage.setItem('operacionespactoDirectoTotal', JSON.stringify(this.total));
        localStorage.setItem('operacionespactoDirectoJornada', JSON.stringify(this.jornada));
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
    */
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
      this.selectedIds = new Set(this.dataSourceH.data.map(row => row.ID_OPER));
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
  onCheckboxChange(event: MatCheckboxChange, row: pactoDirecto) {
    if (event.checked) {
      this.selection.select(row);
      this.selectedIds.add(row.ID_OPER);
    } else {
      this.selection.deselect(row);
      this.selectedIds.delete(row.ID_OPER);
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
    const operacionesSeleccionadas = this.dataSourceH.data.filter(row => selectedIdsArray.includes(row.ID_OPER));
    // Filtrar operaciones ya cerradas (estatus numérico: 2)
    const yaCerradas = operacionesSeleccionadas.filter(op => Number(op.STATUS_ENVIO) === 1);
    const idsValidos = operacionesSeleccionadas.filter(op => Number(op.STATUS_ENVIO) !== 1).map(op => op.ID_OPER);

    if (yaCerradas.length === selectedIdsArray.length) {
      this._snackBar.open('No hay operaciones válidas para procesar (todas ya están en "lote cerrado").', 'Cerrar', { duration: 4000 });
      return;
    }
    if (yaCerradas.length > 0) {
      this._snackBar.open(
        `Algunas operaciones ya están en "lote cerrado" y serán omitidas: ${yaCerradas.map(op => op.ID_OPER).join(', ')}`,
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
      .filter(row => Number(row.STATUS_ENVIO) !== 1 && Number(row.STATUS_ENVIO) !== 2)
      .map(row => row.ID_OPER);
  } else {
    // Solo los seleccionados y que no sean 2 ni 3
    const operacionesSeleccionadas = this.dataSourceH.data.filter(row => selectedIdsArray.includes(row.ID_OPER));
    idsValidos = operacionesSeleccionadas
      .filter(op => Number(op.STATUS_ENVIO) != 1 && Number(op.STATUS_ENVIO) !== 2)
      .map(op => op.ID_OPER);

    const yaCerradasOAnuladas = operacionesSeleccionadas.filter(op => Number(op.STATUS_ENVIO) === 1 || Number(op.STATUS_ENVIO) === 2);
    if (yaCerradasOAnuladas.length === selectedIdsArray.length) {
      this._snackBar.open('No hay operaciones válidas para procesar (todas ya están en "lote cerrado" o "anulada").', 'Cerrar', { duration: 4000 });
      return;
    }
    if (yaCerradasOAnuladas.length > 0) {
      this._snackBar.open(
        `Algunas operaciones ya están en "lote cerrado" o "anulada" y serán omitidas: ${yaCerradasOAnuladas.map(op => op.ID_OPER).join(', ')}`,
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