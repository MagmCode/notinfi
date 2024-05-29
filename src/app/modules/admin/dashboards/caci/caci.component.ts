import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { solicitudesDto } from 'app/models/usuario';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Overlay, OverlayRef, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-caci',
  templateUrl: './caci.component.html',
  styleUrls: ['./caci.component.scss']
})
export class CaciComponent implements OnInit {

  data: any;
  user = {} as User;
  usuario = {} as any;
  solicitudesDto = {} as any;
  plantillaUsuario = {} as solicitudesDto;
  creadas: any;
  rechazadas: any;
  enProceso: any;
  exitoso: any;
  //#region  tablas
  displayedColumns: string[] = ['Idsolicitud','categoria', 'tipoServicio', 'servicio', 'codigoUsuario', 'cedula', 'nombres', 'codUnidad','unidad','ubicacionFisica', 'fechaCreacion', 'estatus','nombresResp', 'acciones'];
  positionOptions: TooltipPosition[] = ['below'];
  position = new FormControl(this.positionOptions[0]);

  dataSource: MatTableDataSource<solicitudesDto>;    
  dataSourceH: MatTableDataSource<solicitudesDto>;
  ELEMENT_DATA: solicitudesDto[] = [];
  ELEMENT_HISTORICO: solicitudesDto[] = [];
 /*  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorP: MatPaginator;
  @ViewChild(MatPaginator) paginatorH: MatPaginator; */
  @ViewChild(MatSort) sort: MatSort = new MatSort;  
  @ViewChild(MatSort) sortH: MatSort = new MatSort;
  
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginatorH') paginatorH: MatPaginator;
 //#endregion
//#region toast
override2 = {
  positionClass: 'toast-bottom-full-width',
  closeButton: true,
  
};
//#endregion

//#region  spinner
private overlayRef!: OverlayRef;
//#endregion

  /**
   * Constructor
   */
  constructor(public dialog: MatDialog,
              private _router: Router,
              private _loginService : LoginService,        
              private _loginservices: LoginService,
              private _solicitudesService : SolicitudesService, 
              private toast: ToastrService,
              private spinner: NgxSpinnerService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private cdRef : ChangeDetectorRef,
              private overlay: Overlay,                
            private formBuilder : FormBuilder,
  )
  {

         // Asi la data a elemento dataSource asi se vacia para su inicializacion
     this.dataSource = new MatTableDataSource(this.ELEMENT_DATA); 
     this.dataSourceH = new MatTableDataSource(this.ELEMENT_HISTORICO); 
     
  
    
  }

  
  ngOnInit(): void
  {

      this.obtenerPlantilla();
      
      this.usuario = this._loginService.obterTokenInfo();
  
      this.user.name = this.usuario.nombres + ' ' +this.usuario.apellidos;  
      this.user.email =this.usuario.descCargo;   
      this.dataSource.paginator = this.paginator;   
      
      this.dataSource.paginator = this.paginatorH;
  }

     ngOnDestroy(): void
     {
     
     }

  ngAfterViewInit() {


     
      this.dataSource.paginator = this.paginator;
      
      this.dataSource.sort = this.sort;

     
      this.dataSourceH.paginator = this.paginatorH;
      this.dataSourceH.sort = this.sortH;
 

    
     
    }

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

  


    
    applyFilterH(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSourceH.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSourceH.paginator) {
        this.dataSourceH.paginator.firstPage();
      }
    }

async obtenerPlantilla(){
      this.usuario = this._loginservices.obterTokenInfo();

      this._solicitudesService.consultarSolicitudesEnProcesoCaci().subscribe(
      (response) =>{
          this.ELEMENT_DATA = [];
          this.ELEMENT_DATA = response.data;
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.ngAfterViewInit();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          this._solicitudesService.consultarEstadisticaCaci().subscribe(
            (response) =>{
              this.creadas= response.data[0].creadas;
              this.rechazadas= response.data[0].rechazadas;
              this.enProceso= response.data[0].enProceso;
              this.exitoso= response.data[0].exitoso;
            }
            )
      }
      );



    }

    tabClick(tab) {

      if (tab.index == 1 ) {
  
          this.usuario = this._loginservices.obterTokenInfo();
          this.usuario = this._loginservices.obterTokenInfo();
 
          this._solicitudesService.consultarHistoricoCaci().subscribe(
          (response) =>{
        
              this.ELEMENT_HISTORICO = [];
              this.ELEMENT_HISTORICO = response.data;
              this.dataSourceH = new MatTableDataSource(this.ELEMENT_HISTORICO);
              this.ngAfterViewInit();
             /*  this.dataSourceH.paginator = this.paginatorH;
              this.dataSourceH.sort= this.sortH; */
          }
          )
  


      }else {
        this.ngAfterViewInit();
        /* this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort; */
      }


    }

 /*    openDialog(id: number, codUsuarioI : string, nombres : string ,categoria:string,tipoServicio: string,servicio:string,  decision: String ) {
     
      const dialogRef = this.dialog.open(ModaldecisionesComponent,{
        data: { idSolicitud :id, codigoUsuario: codUsuarioI ,  nombres:nombres ,decision: decision, categoria: categoria, tipoServicio:tipoServicio, servicio:servicio },
      });
      
      dialogRef.afterClosed().subscribe(result => {
        
      });
    }
     */
    redirigirSuccess(){
      
      this._router.navigate(['/solicitudes/gestionarSolicitudes']);
    }

    obtenerDatos(idSolicitud: any){
      
      sessionStorage.setItem('idSolicitud', idSolicitud);
      this._router.navigate(['/solicitudes/detalleSolicitud']); 
    
    
    }

    obtenerDatosApobar(idSolicitud: any){
   
      sessionStorage.setItem('idSolicitud', idSolicitud);
      this._router.navigate(['/solicitudes/decisionSolicitud']); 
    
    
    }

}
