// #region Imports
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'app/services/service.service';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { SelectionModel } from '@angular/cdk/collections';
import {MatSnackBar} from '@angular/material/snack-bar';
import { IntencionVenta } from 'app/models/intencionVenta'; 



@Component({
  selector: 'app-intencion-venta',
  templateUrl: './intencion-venta.component.html',
  styleUrls: ['./intencion-venta.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class IntencionVentaComponent implements OnInit {
 @ViewChild('intencionVentaForm') intencionVentaForm: NgForm;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

//#region Variables
  intencionVentaFb: FormGroup;
  lastBusqueda: { fechaDesde: string; fechaHasta: string } | null = null;
  selectedTabIndex = 0; 
  
  today: Date = new Date();


 selectedIds: Set<any> = new Set<any>();

  isLoading: boolean = false;

  selection = new SelectionModel<IntencionVenta>(true, []);

  canViewTab: boolean = false;
 

  //#region  tablas
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
  positionOptions: TooltipPosition[] = ['below'];
  position = new FormControl(this.positionOptions[0]);

  dataSourceH: MatTableDataSource<IntencionVenta>;

  interven: MatTableDataSource<IntencionVenta>;

  intervencion: any[] = [];

  @ViewChild(MatSort) sortH: MatSort;
  
  @ViewChild(MatPaginator) paginatorH: MatPaginator;

  // #region Constructor
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


ngAfterViewInit() {
  this.dataSourceH.paginator = this.paginatorH;
  this.dataSourceH.sort = this.sortH;



 
}

// #region ngOnInit
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

private fechaHastaMayorQueFechaDesde(group: FormGroup): { [key: string]: boolean } | null {
  const fechaDesde = group.get('fechaDesde')?.value;
  const fechaHasta = group.get('fechaHasta')?.value;

  if (fechaDesde && fechaHasta && fechaHasta < fechaDesde) {
    return { fechaHastaMenor: true };
  }
  return null;
}


ngOnDestroy(): void {
  // Limpia los datos guardados
  localStorage.removeItem('intencionVentaBusqueda');
  localStorage.removeItem('intencionVentaResultados');
  console.log('Datos de búsqueda y resultados eliminados al salir del componente.');
}

  // #region Suscripcion
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
      },
      error: (err) => {
          console.error('Error al consultar Intención Retiro:', err);
          alert('Ocurrió un error al realizar la consulta.');
      }
    });
}

exportarExcel(): void {
  if (!this.lastBusqueda) {
    alert('Primero realice una consulta válida.');
    return;
  }
  this._service.exportarIntencionVenta(this.lastBusqueda).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Intenciones.xls';
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



inicio(): void {
  // Navega al menú principal
  this._router.navigate(['/menu-principal/']);
}

regresar(): void {
  this.selectedTabIndex = 0; 
  this.canViewTab = false; // Deshabilita la vista de resultados
  
}
}
