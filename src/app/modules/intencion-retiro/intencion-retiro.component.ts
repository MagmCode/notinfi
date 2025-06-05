/**
 * Componente para la gestión y consulta de Intención de Retiro.
 * Permite filtrar por criterios, visualizar resultados en tabla, exportar a Excel y limpiar filtros/resultados.
 * Incluye manejo de paginación, selección múltiple, persistencia de filtros/resultados en localStorage y validaciones personalizadas.
 * Si deseas filtrar por agencia y estatus, descomenta el bloque indicado en el filterPredicate.
 */

import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { IntencionRetiro } from 'app/models/intencionRetiro';

interface TableFilter {
  text: string;
  estatus: string;
}

@Component({
  selector: 'app-intencion-retiro',
  templateUrl: './intencion-retiro.component.html',
  styleUrls: ['./intencion-retiro.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class IntencionRetiroComponent implements OnInit {

  //#region Variables

  /** Formulario reactivo para los criterios de búsqueda */
  intencionRetiroFb: FormGroup;

  /** Índice de la pestaña seleccionada */
  selectedTabIndex = 0;

  /** Lista de agencias comerciales para el filtro */
  agencias: any[] = [];

  /** Última búsqueda realizada (criterios) */
  lastBusqueda: { fechaDesde: string; fechaHasta: string } | null = null;

  /** Fecha de hoy para usar como valor por defecto y como máximo en los datepickers */
  today: Date = new Date();

  /** Filtros de la tabla */
  tableFilter: TableFilter = {
    text: '',
    estatus: 'todas'
  };

  /** IDs seleccionados en la tabla */
  selectedIds: Set<any> = new Set<any>();

  /** Indica si la información está cargando */
  isLoading: boolean = false;

  /** Selección múltiple para la tabla */
  selection = new SelectionModel<IntencionRetiro>(true, []);

  //#region Tablas

  /** Columnas a mostrar en la tabla de resultados */
  displayedColumns: string[] = [
    'rif', 'nombreEmpresa', 'moneda', 'montoDivisa', 'numeroCuentaOrigen',
    'porcentajeComision', 'montoComision', 'agencia', 'estatus', 'fechaHoraOperacion'
  ];

  /** Opciones de posición para tooltips */
  positionOptions: TooltipPosition[] = ['below'];
  position = new FormControl(this.positionOptions[0]);

  /** Fuente de datos para la tabla de resultados */
  dataSourceH: MatTableDataSource<IntencionRetiro>;

  /** Fuente de datos auxiliar (no usada en este fragmento) */
  interven: MatTableDataSource<IntencionRetiro>;

  /** Arreglo auxiliar para intervenciones */
  intervencion: any[] = [];

  /** Referencia al MatSort de la tabla */
  @ViewChild(MatSort) sortH: MatSort;

  /** Referencia al MatPaginator de la tabla */
  @ViewChild(MatPaginator) paginatorH: MatPaginator;

  // #region Constructor
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _service: ServiceService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {
    // Inicializa la fuente de datos vacía
    this.dataSourceH = new MatTableDataSource(this.intervencion);
  }

  /**
   * Procesa el formulario y cambia a la pestaña de resultados.
   */
  processForm() {
    this.selectedTabIndex = 1;
  }

    /**
   * Inicializa el paginador y el ordenamiento de la tabla después de la vista.
   */
  ngAfterViewInit() {
    this.dataSourceH.paginator = this.paginatorH;
    this.dataSourceH.sort = this.sortH;
  }


  /**
   * Inicializa el componente, carga agencias, recupera filtros/resultados guardados y configura el formulario.
   * Si no hay datos guardados, inicializa el formulario vacío.
   */
  ngOnInit(): void {
    // Carga agencias comerciales para el filtro
    this._service.consultaOficinascomerciales().subscribe({
      next: (respuesta: any) => {
        if (respuesta && respuesta.data && Array.isArray(respuesta.data)) {
          this.agencias = respuesta.data.map((oficina: any) => ({
            nro: oficina.nro,
            nombre: oficina.descripcion,
          })).sort((a,b) => a.nro.localeCompare(b.nro, undefined, { numeric: true }));
        } else {
          this.agencias = [];
        }
      },
      error: (err) => {
        console.error('Error al cargar las agencias:', err);
      }
    });

    // Recupera los criterios de búsqueda guardados
    const savedBusqueda = localStorage.getItem('intencionRetiroBusqueda');
    if (savedBusqueda) {
      const busqueda = JSON.parse(savedBusqueda);
      this.lastBusqueda = busqueda;

      // Rellena el formulario con los datos guardados
      this.intencionRetiroFb = this._formBuilder.group({
        fechaDesde: [busqueda.fechaDesde, Validators.required],
        fechaHasta: [busqueda.fechaHasta, Validators.required],
        nacionalidad: [busqueda.nacionalidad],
        documento: [busqueda.documento],
        agencia: [busqueda.agencia],
        estatus: [busqueda.estatus]
      }, { validators: this.fechaHastaMayorQueFechaDesde });

      // Recupera los resultados guardados
      const savedResultados = localStorage.getItem('intencionRetiroResultados');
      if (savedResultados) {
        const resultados = JSON.parse(savedResultados);
        this.dataSourceH = new MatTableDataSource(resultados);

        // Configura el filtro personalizado
        this.dataSourceH.filterPredicate = (data: IntencionRetiro, filter: string) => {
          try {
            const parsed = JSON.parse(filter);
            // --- BLOQUE DE FILTRO AVANZADO ---
            // Descomentar si se necesita filtrar por agencia y estatus
            // let filtro = { agencia: '', estatus: '' };
            // try { filtro = JSON.parse(filter); } catch {}
            // const filtroAgencia = filtro.agencia ? filtro.agencia.trim().toLowerCase() : '';
            // const filtroEstatus = filtro.estatus ? filtro.estatus.trim().toLowerCase() : '';
            // const agenciaData = data.agencia ? data.agencia.trim().toLowerCase() : '';
            // const estatusData = data.estatus ? data.estatus.trim().toLowerCase() : '';
            // // Si hay filtro de agencia, siempre debe coincidir
            // if (filtroAgencia && agenciaData !== filtroAgencia) {
            //   return false;
            // }
            // // Si el estatus es 'todas' o vacío, mostrar todos los estatus de esa agencia
            // if (!filtroEstatus || filtroEstatus === 'todas') {
            //   return true;
            // }
            // // Si hay filtro de estatus, debe coincidir también
            // return estatusData === filtroEstatus;
            // --- FIN BLOQUE DE FILTRO AVANZADO ---
            return true; // Siempre mostrar todos los registros
          } catch {
            // Filtro global por texto (input de búsqueda)
            const search = filter.trim().toLowerCase();
            if (!search) return true;
            return (
              (data.rif && data.rif.toLowerCase().includes(search)) ||
              (data.nombreEmpresa && data.nombreEmpresa.toLowerCase().includes(search)) ||
              (data.moneda && data.moneda.toLowerCase().includes(search)) ||
              (data.montoDivisa && data.montoDivisa.toString().toLowerCase().includes(search)) ||
              (data.numeroCuentaOrigen && data.numeroCuentaOrigen.toLowerCase().includes(search)) ||
              (data.porcentajeComision && data.porcentajeComision.toString().toLowerCase().includes(search)) ||
              (data.montoComision && data.montoComision.toString().toLowerCase().includes(search)) ||
              (data.agencia && data.agencia.toLowerCase().includes(search)) ||
              (data.estatus && data.estatus.toLowerCase().includes(search)) ||
              (data.fechaHoraOperacion && data.fechaHoraOperacion.toLowerCase().includes(search))
            );
          }
        };

        // Aplica el filtro inicial basado en la agencia y estatus seleccionados
        this.dataSourceH.filter = JSON.stringify({ agencia: busqueda.agencia, estatus: busqueda.estatus });

        // Cambia al tab de resultados
        this.selectedTabIndex = 1;
      }
    } else {
      // Inicializa el formulario si no hay datos guardados
      this.intencionRetiroFb = this._formBuilder.group({
        fechaDesde: [this.today, Validators.required],
        fechaHasta: [this.today, Validators.required],
        nacionalidad: [''],
        documento: [''],
        agencia: [''],
        estatus: ['']
      }, { validators: this.fechaHastaMayorQueFechaDesde });

      // ===========================
      // DATOS DE PRUEBA (MOCK DATA)
      // ===========================
      // const mockData: IntencionRetiro[] = [
      //   {
      //     rif: 'J-12345678-9',
      //     nombreEmpresa: 'Empresa Prueba 1',
      //     moneda: 'USD',
      //     montoDivisa: 1000,
      //     numeroCuentaOrigen: '0102-0123-4567-8901',
      //     porcentajeComision: 1.5,
      //     montoComision: 15,
      //     agencia: 'Agencia 001',
      //     estatus: 'Pendiente',
      //     fechaHoraOperacion: '01/06/2025 10:00'
      //   },
      //   {
      //     rif: 'J-98765432-1',
      //     nombreEmpresa: 'Empresa Prueba 2',
      //     moneda: 'EUR',
      //     montoDivisa: 2000,
      //     numeroCuentaOrigen: '0102-0987-6543-2109',
      //     porcentajeComision: 2,
      //     montoComision: 40,
      //     agencia: 'Agencia 002',
      //     estatus: 'Procesado',
      //     fechaHoraOperacion: '02/06/2025 11:30'
      //   }
      // ];

      // this.dataSourceH = new MatTableDataSource(mockData);

      // Configura el filtro personalizado (mantén los bloques comentados para filtrar por agencia y estatus)
      this.dataSourceH.filterPredicate = (data: IntencionRetiro, filter: string) => {
        try {
          const parsed = JSON.parse(filter);
          // --- BLOQUE DE FILTRO AVANZADO ---
          // Descomentar si se necesita filtrar por agencia y estatus
          // let filtro = { agencia: '', estatus: '' };
          // try { filtro = JSON.parse(filter); } catch {}
          // const filtroAgencia = filtro.agencia ? filtro.agencia.trim().toLowerCase() : '';
          // const filtroEstatus = filtro.estatus ? filtro.estatus.trim().toLowerCase() : '';
          // const agenciaData = data.agencia ? data.agencia.trim().toLowerCase() : '';
          // const estatusData = data.estatus ? data.estatus.trim().toLowerCase() : '';
          // if (filtroAgencia && agenciaData !== filtroAgencia) {
          //   return false;
          // }
          // if (!filtroEstatus || filtroEstatus === 'todas') {
          //   return true;
          // }
          // return estatusData === filtroEstatus;
          // --- FIN BLOQUE DE FILTRO AVANZADO ---
          return true;
        } catch {
          const search = filter.trim().toLowerCase();
          if (!search) return true;
          return (
            (data.rif && data.rif.toLowerCase().includes(search)) ||
            (data.nombreEmpresa && data.nombreEmpresa.toLowerCase().includes(search)) ||
            (data.moneda && data.moneda.toLowerCase().includes(search)) ||
            (data.montoDivisa && data.montoDivisa.toString().toLowerCase().includes(search)) ||
            (data.numeroCuentaOrigen && data.numeroCuentaOrigen.toLowerCase().includes(search)) ||
            (data.porcentajeComision && data.porcentajeComision.toString().toLowerCase().includes(search)) ||
            (data.montoComision && data.montoComision.toString().toLowerCase().includes(search)) ||
            (data.agencia && data.agencia.toLowerCase().includes(search)) ||
            (data.estatus && data.estatus.toLowerCase().includes(search)) ||
            (data.fechaHoraOperacion && data.fechaHoraOperacion.toLowerCase().includes(search))
          );
        }
      };

      // Aplica el filtro inicial (puedes dejarlo vacío para mostrar todo)
      this.dataSourceH.filter = '';

      // Cambia al tab de resultados para ver los datos de prueba
      this.selectedTabIndex = 1;
      // ===========================
      // FIN DATOS DE PRUEBA
      // ===========================
    }
  }

  /**
   * Valida que la fecha hasta no sea menor que la fecha desde.
   */
  private fechaHastaMayorQueFechaDesde(group: FormGroup): { [key: string]: boolean } | null {
    const fechaDesde = group.get('fechaDesde')?.value;
    const fechaHasta = group.get('fechaHasta')?.value;
    if (fechaDesde && fechaHasta && fechaHasta < fechaDesde) {
      return { fechaHastaMenor: true };
    }
    return null;
  }

  ngOnDestroy(): void {
    localStorage.removeItem('intencionRetiroBusqueda');
    localStorage.removeItem('intencionRetiroResultados');
    console.log('Datos de búsqueda y resultados eliminados al salir del componente.');
  }

  /**
   * Realiza la consulta de intención de retiro y actualiza la tabla de resultados.
   */
  consultarIntencionRetiro(): void {
    if (this.intencionRetiroFb.invalid) {
      alert('Por favor, completa los campos obligatorios.');
      return;
    }

    this.isLoading = true;

    const formValue = this.intencionRetiroFb.value;
    let agenciaDescripcion = '';
    if (formValue.agencia && formValue.agencia !== 'TODAS') {
      const agenciaObj = this.agencias.find(a => a.nro === formValue.agencia);
      agenciaDescripcion = agenciaObj ? agenciaObj.nombre : '';
    }
    const requestData = {
      fechaDesde: this.formatearFecha(formValue.fechaDesde),
      fechaHasta: this.formatearFecha(formValue.fechaHasta),
      // nacionalidad: formValue.nacionalidad,
      // agencia: formValue.agencia,
      // estatus: formValue.estatus
    };
    const filtrosFront = {
      nacionalidad: formValue.nacionalidad,
      documento: formValue.documento,
      agencia: agenciaDescripcion,
      estatus: formValue.estatus
    };
    this.lastBusqueda = { ...requestData, ...filtrosFront };
    localStorage.setItem('intencionRetiroBusqueda', JSON.stringify(this.lastBusqueda));
    this._service.consultaIntencionRetiro(requestData).subscribe({
      next: (data: IntencionRetiro[]) => {
        this.dataSourceH = new MatTableDataSource(data);

        // Configura el filtro personalizado
        this.dataSourceH.filterPredicate = (data: IntencionRetiro, filter: string) => {
          try {
            const parsed = JSON.parse(filter);
            // --- BLOQUE DE FILTRO AVANZADO ---
            // Descomentar si se necesita filtrar por agencia y estatus
            // let filtro = { agencia: '', estatus: '' };
            // try { filtro = JSON.parse(filter); } catch {}
            // const filtroAgencia = filtro.agencia ? filtro.agencia.trim().toLowerCase() : '';
            // const filtroEstatus = filtro.estatus ? filtro.estatus.trim().toLowerCase() : '';
            // const agenciaData = data.agencia ? data.agencia.trim().toLowerCase() : '';
            // const estatusData = data.estatus ? data.estatus.trim().toLowerCase() : '';
            // if (filtroAgencia && agenciaData !== filtroAgencia) {
            //   return false;
            // }
            // if (!filtroEstatus || filtroEstatus === 'todas') {
            //   return true;
            // }
            // return estatusData === filtroEstatus;
            // --- FIN BLOQUE DE FILTRO AVANZADO ---
            return true;
          } catch {
            const search = filter.trim().toLowerCase();
            if (!search) return true;
            return (
              (data.rif && data.rif.toLowerCase().includes(search)) ||
              (data.nombreEmpresa && data.nombreEmpresa.toLowerCase().includes(search)) ||
              (data.moneda && data.moneda.toLowerCase().includes(search)) ||
              (data.montoDivisa && data.montoDivisa.toString().toLowerCase().includes(search)) ||
              (data.numeroCuentaOrigen && data.numeroCuentaOrigen.toLowerCase().includes(search)) ||
              (data.porcentajeComision && data.porcentajeComision.toString().toLowerCase().includes(search)) ||
              (data.montoComision && data.montoComision.toString().toLowerCase().includes(search)) ||
              (data.agencia && data.agencia.toLowerCase().includes(search)) ||
              (data.estatus && data.estatus.toLowerCase().includes(search)) ||
              (data.fechaHoraOperacion && data.fechaHoraOperacion.toLowerCase().includes(search))
            );
          }
        };

        this.dataSourceH.filter = JSON.stringify({ agencia: agenciaDescripcion, estatus: formValue.estatus });
        localStorage.setItem('intencionRetiroResultados', JSON.stringify(data));
        this.selectedTabIndex = 1;
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
    const requestData = {
      fechaDesde: this.lastBusqueda.fechaDesde,
      fechaHasta: this.lastBusqueda.fechaHasta
    };
    this._service.exportarIntencionRetiro(requestData).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Retiro.xls';
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
    if (event.index === 1) { 
      this.dataSourceH.paginator = this.paginatorH;
      this.dataSourceH.sort = this.sortH;
      console.log('Paginador inicializado:', this.dataSourceH.paginator);
    } else if (event.index === 0) {
      this.intencionRetiroFb = this._formBuilder.group({
        fechaDesde: [this.today, Validators.required],
        fechaHasta: [this.today, Validators.required],
        nacionalidad: [''],
        documento: [''],
        agencia: [''],
        estatus: ['']
      }, { validators: this.fechaHastaMayorQueFechaDesde });
      localStorage.removeItem('intencionRetiroBusqueda');
      localStorage.removeItem('intencionRetiroResultados');
    }
  }

  inicio(): void {
    this._router.navigate(['/menu-principal/']);
  }

  regresar(): void {
    localStorage.removeItem('intencionRetiroBusqueda');
    localStorage.removeItem('intencionRetiroResultados');
    this.intencionRetiroFb = this._formBuilder.group({
      fechaDesde: [this.today, Validators.required],
      fechaHasta: [this.today, Validators.required],
      nacionalidad: [''],
      documento: [''],
      agencia: [''],
      estatus: ['']
    }, { validators: this.fechaHastaMayorQueFechaDesde });
    this.selectedTabIndex = 0;
  }
}
