// #region Imports
import { Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
// import { NgForm, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { intervencion, jornadaActiva, respuestaIntervencion } from 'app/models/intervencion';
import { ServiceService } from 'app/services/service.service';
// import { TooltipPosition } from '@angular/material/tooltip';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
// import { MatDialog } from '@angular/material/dialog';
// import { MatTabGroup } from '@angular/material/tabs';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatCheckboxChange } from '@angular/material/checkbox'; // No se usa
// import { ToastrService } from 'ngx-toastr'; // No se usa
// #endregion

@Component({
  selector: 'jornada-intervencion',
  templateUrl: './jornada-intervencion.component.html',
  styleUrls: ['./jornada-intervencion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class JornadaIntervencionComponent implements OnInit, AfterViewInit {
  // @ViewChild('operacionesInterverForm') operacionesInterverForm: NgForm; // No se usa en el código actual
  // @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  //#region Variables
  // operaInterForm: FormGroup;
  selectedTabIndex = 0;
  isLoading: boolean = false;

  // Variables relacionadas con la tabla
  displayedColumns: string[] = [
    'tipoIntervencion',
    'coVentaBCV',
    'fechaInicio',
    'fechaFin',
    'fechaValor',
    'tipoCambio',
    'coMonedaIso',
    'saldoDisponible',
    'semana'
  ];
  dataSourceH: MatTableDataSource<jornadaActiva> = new MatTableDataSource([]);
  @ViewChild(MatSort) sortH: MatSort = new MatSort();
  @ViewChild(MatPaginator) paginator: MatPaginator;


  // cantidad: string = '';
  // // total: string = '';
  // jornada: any[] = [];
  // intervencion: any[] = [];
  // selection = new SelectionModel<intervencion>(true, []);
  //#endregion

  // #region Constructor
  constructor(
    // private _formBuilder: FormBuilder,
    private _router: Router,
    private _service: ServiceService,
    private _snackBar: MatSnackBar
    // public dialog: MatDialog,
    // private _snackBar: MatSnackBar
  ) {}
  // #endregion

  // #region Métodos principales
  ngOnInit(): void {
    this.isLoading = true;
    const LOCAL_KEY = 'jornadaActivaCache';
    this._service.jornadaActiva$.subscribe({
        next: (jornada) => {
            if (jornada.length === 0) {
                // Si no hay datos precargados, realiza la consulta al backend
                this._service.consultaJornadaActiva().subscribe({
                    next: (jornada) => {
                        // Guardar en localStorage
                        localStorage.setItem(LOCAL_KEY, JSON.stringify(jornada));
                        this.dataSourceH = new MatTableDataSource(jornada);
                        this.dataSourceH.sortingDataAccessor = (item, property) => {
                            if (property === 'tipoIntervencion') {
                                return item.tipoIntervencion?.nombreTipoIntervencion || '';
                            }
                            if (property === 'coMonedaIso') {
                                return item.codigoIsoDivisa?.coMonedaIso || '';
                            }
                            if (property === 'tipoCambio') {
                                return item.tipoCambioIntervencion && item.tipoCambioIntervencion[0]?.tipoCambio != null ? item.tipoCambioIntervencion[0].tipoCambio : '';
                            }
                            if (property === 'fechaValor') {
                                return item.tipoCambioIntervencion && item.tipoCambioIntervencion[0]?.fechaValor ? item.tipoCambioIntervencion[0].fechaValor : '';
                            }
                            return item[property];
                        };
                        this.dataSourceH.paginator = this.paginator;
                        this.dataSourceH.sort = this.sortH;
                        this.isLoading = false;
                    },
                    error: (err) => {
                        // Si falla, intenta cargar desde localStorage
                        const cache = localStorage.getItem(LOCAL_KEY);
                        if (cache) {
                            const jornadaCache = JSON.parse(cache);
                            this.dataSourceH = new MatTableDataSource(jornadaCache);
                            this.dataSourceH.sortingDataAccessor = (item, property) => {
                                if (property === 'tipoIntervencion') {
                                    return item.tipoIntervencion?.nombreTipoIntervencion || '';
                                }
                                if (property === 'coMonedaIso') {
                                    return item.codigoIsoDivisa?.coMonedaIso || '';
                                }
                                if (property === 'tipoCambio') {
                                    return item.tipoCambioIntervencion && item.tipoCambioIntervencion[0]?.tipoCambio != null ? item.tipoCambioIntervencion[0].tipoCambio : '';
                                }
                                if (property === 'fechaValor') {
                                    return item.tipoCambioIntervencion && item.tipoCambioIntervencion[0]?.fechaValor ? item.tipoCambioIntervencion[0].fechaValor : '';
                                }
                                return item[property];
                            };
                            this.dataSourceH.paginator = this.paginator;
                            this.dataSourceH.sort = this.sortH;
                            this._snackBar.open(
                              'No se ha podido actualizar la jornada.', 
                              'Cerrar', 
                              { duration: 6000, horizontalPosition: 'right'}
                            );
                        } else {
                            this.dataSourceH = new MatTableDataSource([]);
                        }
                        this.isLoading = false;
                    }
                });
            } else {
                // Usa los datos precargados
                localStorage.setItem(LOCAL_KEY, JSON.stringify(jornada));
                this.dataSourceH = new MatTableDataSource(jornada);
                this.dataSourceH.sortingDataAccessor = (item, property) => {
                    if (property === 'tipoIntervencion') {
                        return item.tipoIntervencion?.nombreTipoIntervencion || '';
                    }
                    if (property === 'coMonedaIso') {
                        return item.codigoIsoDivisa?.coMonedaIso || '';
                    }
                    if (property === 'tipoCambio') {
                        return item.tipoCambioIntervencion && item.tipoCambioIntervencion[0]?.tipoCambio != null ? item.tipoCambioIntervencion[0].tipoCambio : '';
                    }
                    if (property === 'fechaValor') {
                        return item.tipoCambioIntervencion && item.tipoCambioIntervencion[0]?.fechaValor ? item.tipoCambioIntervencion[0].fechaValor : '';
                    }
                    return item[property];
                };
                this.dataSourceH.paginator = this.paginator;
                this.dataSourceH.sort = this.sortH;
                this.isLoading = false;
            }
        },
        error: (err) => {
            // Si falla la suscripción, intenta cargar desde localStorage
            const cache = localStorage.getItem(LOCAL_KEY);
            if (cache) {
                const jornadaCache = JSON.parse(cache);
                this.dataSourceH = new MatTableDataSource(jornadaCache);
                this.dataSourceH.sortingDataAccessor = (item, property) => {
                    if (property === 'tipoIntervencion') {
                        return item.tipoIntervencion?.nombreTipoIntervencion || '';
                    }
                    if (property === 'coMonedaIso') {
                        return item.codigoIsoDivisa?.coMonedaIso || '';
                    }
                    if (property === 'tipoCambio') {
                        return item.tipoCambioIntervencion && item.tipoCambioIntervencion[0]?.tipoCambio != null ? item.tipoCambioIntervencion[0].tipoCambio : '';
                    }
                    if (property === 'fechaValor') {
                        return item.tipoCambioIntervencion && item.tipoCambioIntervencion[0]?.fechaValor ? item.tipoCambioIntervencion[0].fechaValor : '';
                    }
                    return item[property];
                };
                this.dataSourceH.paginator = this.paginator;
                this.dataSourceH.sort = this.sortH;
                this._snackBar.open('No se ha podido actualizar la jornada. Mostrando datos previos.', 'Cerrar', { duration: 6000 });
            } else {
                this.dataSourceH = new MatTableDataSource([]);
            }
            this.isLoading = false;
        }
    });
}
  ngAfterViewInit(): void {
    this.dataSourceH.paginator = this.paginator;
    this.dataSourceH.sort = this.sortH;
  }

  // consultarIntervencion(): void {
  //   this.isLoading = true;
  //   this._service.consultaJornadaActiva().subscribe({
  //     next: (resp: respuestaIntervencion) => {
  //       this.intervencion = resp.respIntervencion;
  //       this.dataSourceH = new MatTableDataSource(this.intervencion);
  //       this.selectedTabIndex = 1;
  //       this.cantidad = resp.cantidad;
  //       this.total = resp.totales;
  //       this.jornada = resp.jornadasList;
  //     },
  //     error: (err) => {
  //       console.error('Error:', err);
  //       alert('Ocurrió un error inesperado, por favor vuelve a intentarlo');
  //     },
  //     complete: () => {
  //       this.isLoading = false;
  //       this.dataSourceH.paginator = this.paginator;
  //     }
  //   });
  // }

  applyFilterH(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceH.filter = filterValue.trim().toLowerCase();
    if (this.dataSourceH.paginator) {
      this.dataSourceH.paginator.firstPage();
    }
  }

  getWeekOfMonth(dateString: string): number {
    if (!dateString) {
      console.error('Fecha no válida:', dateString);
      return NaN;
    }
    const parts = dateString.split('/');
    if (parts.length === 3) {
      dateString = `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Fecha no válida después de convertir:', dateString);
      return NaN;
    }
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfMonth = date.getDate();
    const startDayOfWeek = startOfMonth.getDay();
    return Math.ceil((dayOfMonth + startDayOfWeek) / 7);
  }

  menuPrincipal(): void {
    this._router.navigate(['/menu-principal/']);
  }
  // #endregion
}
