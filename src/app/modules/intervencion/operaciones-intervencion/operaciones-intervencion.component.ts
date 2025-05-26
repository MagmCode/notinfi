// #region Imports
import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { intervencion, respuestaIntervencion } from 'app/models/intervencion';
import { ServiceService } from 'app/services/service.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
// import { ToastrService } from 'ngx-toastr';
import { MatTabGroup } from '@angular/material/tabs';
// import { MatCheckboxChange } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { EditOperacionesIntervencionModalComponent } from './edit-operaciones-intervencion-modal/edit-operaciones-intervencion-modal.component'; 
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatCheckboxChange } from '@angular/material/checkbox';


@Component({
  selector: 'operaciones-intervencion',
  templateUrl: './operaciones-intervencion.component.html',
  styleUrls: ['./operaciones-intervencion.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class OperacionesIntervencionComponent implements OnInit {
  @ViewChild('operacionesInterverForm') operacionesInterverForm: NgForm;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

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

processForm() {
  // const formData = this.operaInterForm.value;
  this.selectedTabIndex = 1;
}

ngAfterViewInit() {
  console.log('ngAfterViewInit - paginator:', this.paginator);
  this.dataSourceH.paginator = this.paginator;
  this.dataSourceH.sort = this.sortH;
  console.log('ngAfterViewInit - dataSourceH.paginator:', this.dataSourceH.paginator);
}

onTabChange(event: any): void {
  // Índice del tab de resultados (ajusta si cambia el orden de los tabs)
  if (event.index === 1) {
    this.dataSourceH.paginator = this.paginator;
    this.dataSourceH.sort = this.sortH;
    console.log('onTabChange - paginator asignado:', this.dataSourceH.paginator);
  }
}

// #region ngOnInit
  ngOnInit(): void {
    this.operaInterForm = this._formBuilder.group({
      nroCedRif: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      estatus: ['', [Validators.required]],
      codDivisas: ['', [Validators.required]],
      fechOper: ['', [Validators.required]],
    });
  }
 

  // #region Suscripcion
  consultarIntervencion() {
    this.isLoading = true;

    const form = this.operaInterForm.value;

    const allFieldsEmpty = this.operaInterForm.controls.nroCedRif.pristine &&
                        this.operaInterForm.controls.nacionalidad.pristine &&
                        this.operaInterForm.controls.estatus.pristine &&
                        this.operaInterForm.controls.codDivisas.pristine &&
                        this.operaInterForm.controls.fechOper.pristine;
// Alert if fields are empty
    if (allFieldsEmpty) {
      this._snackBar.open('Por favor, selecciona una fecha', 'Cerrar', {
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
    })

    
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




  menuPrincipal(): void {
    this._router.navigate(['/menu-principal/'])
  }
}
