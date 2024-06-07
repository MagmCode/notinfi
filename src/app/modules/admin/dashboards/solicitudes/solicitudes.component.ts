import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import { User } from 'app/core/user/user.types';
import { TooltipPosition } from '@angular/material/tooltip';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { solicitudesDto } from 'app/models/usuario';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerComponent } from 'app/modules/admin/spinner/spinner.component';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ModaldecisionesComponent } from './modaldecisiones/modaldecisiones.component';

@Component({
    selector       : 'project',
    templateUrl    : './solicitudes.component.html',
    styleUrls: ['./solicitudes.component.scss']
})
export class SolicitudesComponent implements OnInit, OnDestroy
{
   
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
    dataSourceP: MatTableDataSource<solicitudesDto>;  
    dataSourceH: MatTableDataSource<solicitudesDto>;
    ELEMENT_DATA: solicitudesDto[] = [];
    ELEMENT_PENDIENTE: solicitudesDto[] = [];
    ELEMENT_HISTORICO: solicitudesDto[] = [];
   /*  @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatPaginator) paginatorP: MatPaginator;
    @ViewChild(MatPaginator) paginatorH: MatPaginator; */
    @ViewChild(MatSort) sort: MatSort = new MatSort;  
    @ViewChild(MatSort) sortP: MatSort = new MatSort; 
    @ViewChild(MatSort) sortH: MatSort = new MatSort;
    
    @ViewChild('paginator') paginator: MatPaginator;
    @ViewChild('paginatorP') paginatorP: MatPaginator;
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
       this.dataSourceP = new MatTableDataSource(this.ELEMENT_PENDIENTE); 
       this.dataSourceH = new MatTableDataSource(this.ELEMENT_HISTORICO); 
       
    
      
    }

    
    ngOnInit(): void
    {

        this.obtenerPlantilla();
        
        this.usuario = this._loginService.obterTokenInfo();
    
        this.user.name = this.usuario.nombres + ' ' +this.usuario.apellidos;  
        this.user.email =this.usuario.descCargo;   
        this.dataSource.paginator = this.paginator;

        this.dataSource.paginator = this.paginatorP;   
        
        this.dataSource.paginator = this.paginatorH;
    }

       ngOnDestroy(): void
       {
       
       }

    ngAfterViewInit() {
 
  
       
        this.dataSource.paginator = this.paginator;
        
        this.dataSource.sort = this.sort;

       
        this.dataSourceP.paginator = this.paginatorP;
        this.dataSourceP.sort = this.sortP;
 
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

      applyFilterP(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSourceP.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSourceP.paginator) {
          this.dataSourceP.paginator.firstPage();
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

        this._solicitudesService.consultarSolicitudesCreadas(this.usuario.codigo).subscribe(
        (response) =>{
            this.ELEMENT_DATA = [];
            this.ELEMENT_DATA = response.data;
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.ngAfterViewInit();
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;

            this._solicitudesService.consultarEstadisticaSolicitud(this.usuario.codigo).subscribe(
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
   
            this._solicitudesService.consultarSolicitudesAsignadas(this.usuario.codigo).subscribe(
            (response) =>{
        
                this.ELEMENT_PENDIENTE = [];
                this.ELEMENT_PENDIENTE = response.data;
                this.dataSourceP = new MatTableDataSource(this.ELEMENT_PENDIENTE);
                this.ngAfterViewInit();
               /*  this.dataSourceP.paginator = this.paginatorP;
                this.dataSourceP.sort = this.sortP; */
              
            }
            )


        }else if (tab.index == 0){
          this.ngAfterViewInit();
          /* this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort; */
        } else if (tab.index == 2) {
          

          this.usuario = this._loginservices.obterTokenInfo();
   
          this._solicitudesService.consultarSolicitudHistorico(this.usuario.codigo).subscribe(
          (response) =>{
        
              this.ELEMENT_HISTORICO = [];
              this.ELEMENT_HISTORICO = response.data;
              this.dataSourceH = new MatTableDataSource(this.ELEMENT_HISTORICO);
              this.ngAfterViewInit();
             /*  this.dataSourceH.paginator = this.paginatorH;
              this.dataSourceH.sort= this.sortH; */
          }
          )


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

      obtenerDatos(idSolicitud: any,idTipoServicio: any ){
        
  sessionStorage.setItem('idSolicitud', idSolicitud); 
        if (idTipoServicio == 1) {
          this._router.navigate(['/solicitudes/detalleSolicitud']); 
        
        } 

if (idTipoServicio == 2) {
  
  
  this._router.navigate(['/solicitudes/detalleSolProveeduria']);
}
       
      
      }

     obtenerDatosApobar(idSolicitud: any,idTipoServicio:any ){
     

        sessionStorage.setItem('idSolicitud', idSolicitud);
              
        if (idTipoServicio == 1) {
          this._router.navigate(['/solicitudes/decisionSolicitud']); 
        
        } 

        if (idTipoServicio == 2) {
          
          
          this._router.navigate(['/solicitudes/decisionSolProveeduria']);
        }
      
      
      }
}
