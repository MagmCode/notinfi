// #region Imports
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

@Component({
  selector: 'operaciones-intervencion',
  templateUrl: './operaciones-intervencion.component.html',
  styleUrls: ['./operaciones-intervencion.component.scss'],
  // encapsulation: ViewEncapsulation.None
})

export class OperacionesIntervencionComponent implements OnInit, AfterViewInit, OnDestroy {


  //#region Variables
  operaInterForm: FormGroup;
  selectedTabIndex = 0; 
  fileErrorInter: string = '';
  nroCedRif: string = '';
  nacionalidad: string = '';
  estatus: string = '';
  codDivisas: string = '';
  fechOper: string = '';
  cantidad: string = '';
  total: string = '';
  jornada: any[] = [];

  selectedIds: Set<any> = new Set<any>();

  isLoading: boolean = false;

  selection = new SelectionModel<intervencion>(true, []);

  today = new Date();

  //#region  tablas
  displayedColumns: string[] = ['select', 'IdOper','nacionalidad', 'nroCedRif', 'nomCliente', 'operacion', 'mtoDivisas', 'tasaCambio', 'codDivisas','ctaCliente','ctaClienteDivisas','estatus','edit'];
  positionOptions: TooltipPosition[] = ['below'];
  position = new FormControl(this.positionOptions[0]);

  dataSourceH: MatTableDataSource<intervencion>;
  interven: MatTableDataSource<intervencion>;
  intervencion: any[] = [];

  @ViewChild(MatSort) sortH: MatSort = new MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // #region Constructor
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

  openEditDialog(row: any): void {
    const dialogRef = this.dialog.open(EditOperacionesIntervencionModalComponent, {
      width: '800px',
      height: '500px',
      data: row 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("qqqq", result )
        this.consultarIntervencion();  
      }
    });
  }


  ngAfterViewInit() {
    console.log('ngAfterViewInit - paginator:', this.paginator);
    this.dataSourceH.paginator = this.paginator;
    this.dataSourceH.sort = this.sortH;
    console.log('ngAfterViewInit - dataSourceH.paginator:', this.dataSourceH.paginator);
  }

  onTabChange(event: any): void {
    // Si vuelve a la pestaña de búsqueda, limpia el localStorage y resultados
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
      console.log('onTabChange - paginator asignado:', this.dataSourceH.paginator);
    }
  }

  // #region ngOnInit
  ngOnInit(): void {
    // Recupera los criterios de búsqueda guardados
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
      } else {
        this.dataSourceH = new MatTableDataSource([]);
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
            fechOper: [today],
        });

      this.dataSourceH = new MatTableDataSource([]);
    }
  }

  // #region Suscripcion
  consultarIntervencion() {
    this.isLoading = true;

    const form = this.operaInterForm.value;

    // Alert if fields are empty
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


    console.log('Datos enviados al backend (consulta intervencion):', form);
    this._service.consultaIntervencion('intervencionFiltro',form).subscribe({
      next: (resp: respuestaIntervencion) => {
        this.intervencion = resp.respIntervencion;
        this.dataSourceH = new MatTableDataSource(this.intervencion);
        console.log('Antes de asignar paginator - paginator:', this.paginator);
        this.dataSourceH.paginator = this.paginator; // Asegura paginación después de asignar nuevos datos
        this.dataSourceH.sort = this.sortH;
        console.log('Después de asignar paginator - dataSourceH.paginator:', this.dataSourceH.paginator);
        console.log('Datos de la tabla:', this.intervencion);
        this.selectedTabIndex = 1;
        this.cantidad = resp.cantidad;
        this.total = resp.totales;
        this.jornada = resp.jornadasList;
        console.log('respuesta (intervencion):', resp.respIntervencion);
        console.log('respuesta2 (Total):', this.total);
        console.log('respuesta3 (resp):', resp);
        // 1. Guarda los criterios y resultados después de consultar
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
        console.log('Complete - dataSourceH.paginator:', this.dataSourceH.paginator);
      }
    });
  }

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
  
  isAllSelected(): boolean {
    if (!this.dataSourceH || !this.dataSourceH.data) {
      return false;
    }
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceH.data.length;
    return numSelected === numRows;
  }
  
  obtenerIdsSeleccionados() {
    const selectedIdsArray = Array.from(this.selectedIds);
    console.log('IDs seleccionados:', selectedIdsArray);
  }
  
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
  
  processSelectedRows() {
    const selectedIdsArray = Array.from(this.selectedIds);
    alert(`Selected IDs: ${selectedIdsArray.join(', ')}`);
  }

  exportarExcel(): void {
    // Toma los valores del formulario (todos los filtros)
    const filtros = this.operaInterForm.value;
    this._service.exportarIntervencion('intervencionFiltroExportar', filtros).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Intervenciones.xls';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al exportar:', err);
        alert('Ocurrió un error al exportar el archivo.');
      }
    });
  }

  applyFilterH(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceH.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceH.paginator) {
      this.dataSourceH.paginator.firstPage();
    }
  }

  inicio(): void {
    this._router.navigate(['/menu-principal/'])
  }

regresar(): void {
  this.selectedTabIndex = 0;
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

  // Limpia el localStorage si lo deseas (opcional)
  ngOnDestroy(): void {
    localStorage.removeItem('operacionesIntervencionBusqueda');
    localStorage.removeItem('operacionesIntervencionResultados');
    localStorage.removeItem('operacionesIntervencionCantidad');
    localStorage.removeItem('operacionesIntervencionTotal');
    localStorage.removeItem('operacionesIntervencionJornada');
  }
}