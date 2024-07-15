import { Component, OnInit, ViewChild } from '@angular/core';
import { ModaldecisionesComponent } from '../modaldecisiones/modaldecisiones.component';
import { User } from 'app/core/user/user.types';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { servicioGenerales } from 'app/models/infraestructura';
import { TooltipPosition } from '@angular/material/tooltip';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { solicitudesDto } from 'app/models/usuario';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-decision-sol-serv-generales',
  templateUrl: './decision-sol-serv-generales.component.html',
  styleUrls: ['./decision-sol-serv-generales.component.scss']
})
export class DecisionSolServGeneralesComponent implements OnInit {

  user = {} as User;
  solicitudesDto = {} as any;
  usuario = {} as any;
  datosFormulario: FormGroup;  
  idSolicitud : any;
  servicioA: boolean = false;
  servicioR: boolean = false;
  serviA: boolean = false;
  mensaje: any;
  servicioGenerales = {} as any;
 
  servicioP: boolean = false;
  esValido:  boolean = false;
  hasError :boolean = false;
  estareaA :boolean = false;
  estareaC :boolean = false;
  
  metodo = [];

  radioSelected: any;
    //#region  tablas
    displayedColumnsP: string[] = ['tipoSolicitud','detalleSol','observacion','personal','observacionArea'];
    positionOptionsP: TooltipPosition[] = ['below'];
    positionP = new FormControl(this.positionOptionsP[0]);
    dataSourceP: MatTableDataSource<servicioGenerales>;
    ELEMENT_DATAP: servicioGenerales[] = [];

    displayedColumnsPM: string[] = ['tipoSolicitud','detalleSol','observacion'];
    positionOptionsPM: TooltipPosition[] = ['below'];
    positionPM = new FormControl(this.positionOptionsPM[0]);
    dataSourcePM: MatTableDataSource<servicioGenerales>;
    ELEMENT_DATAPM: servicioGenerales[] = [];

    displayedColumns: string[] = ['nombreTarea', 'codUsuarioInicio', 'nombreUsuarioInicio', 'fechaInicio', 'codUsuarioFin', 'nombreUsuarioFin', 'fechaFin','decision', 'motivo', 'observacion'];
    positionOptions: TooltipPosition[] = ['below'];
     position = new FormControl(this.positionOptions[0]);
     dataSource: MatTableDataSource<solicitudesDto>;   
     ELEMENT_DATA: solicitudesDto[] = [];

   @ViewChild(MatPaginator) paginator: MatPaginator | any;
   @ViewChild(MatSort) sort: MatSort = new MatSort;  
   @ViewChild(MatTable) tableP: MatTable<servicioGenerales>; 
    
   @ViewChild(MatTable) tablePM: MatTable<servicioGenerales>; 
   @ViewChild(MatTable) table: MatTable<solicitudesDto>;
    //#endregion

     //#region toast
override2 = {
  positionClass: 'toast-bottom-full-width',
  closeButton: true,
  
};
//#endregion


protected _onDestroy = new Subject<void>();
constructor(private _loginService : LoginService,  
  private _loginservices: LoginService,
  private _solicitudesService : SolicitudesService,              
  private formBuilder : FormBuilder, 
  private route: ActivatedRoute ,
  private toast: ToastrService,
  private spinner: NgxSpinnerService,
  private _router: Router,
  public dialog: MatDialog,) { 

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA); 
    this.dataSourceP = new MatTableDataSource(this.ELEMENT_DATAP);
    this.dataSourcePM = new MatTableDataSource(this.ELEMENT_DATAPM);
    this.datosFormulario = formBuilder.group({

      idSolicitud:  new FormControl(''),
      codigoUsuario:  new FormControl(''),
      cedula:  new FormControl(''),
      nombres:  new FormControl(''),
      codUnidad: new FormControl(''),
      unidad:  new FormControl(''),
      codUnidadOrg:  new FormControl(''),
      unidadOrg:  new FormControl(''),
      codUnidadJrq:  new FormControl(''),
      unidadJrq:  new FormControl(''),
      ubicacionFisica:  new FormControl(''),
      fechaCreacion:  new FormControl(''),
      fechaModificacion:  new FormControl(''),
      estatus: new FormControl(''),
      idServicio: new FormControl(''),
      servicio:  new FormControl(''),
      responsable:  new FormControl(''),
      codigoUsuarioResp:  new FormControl(''),
      cedulaResp:  new FormControl(''),
      nombresResp:  new FormControl(''),
      codUnidadResp: new FormControl(''),
      unidadResp:  new FormControl(''),
      idTarea:  new FormControl(''),
      tarea:  new FormControl(''),
      codusuarioGestion:  new FormControl(''),
      decision: new FormControl(''),
      idCategoria:    new FormControl(''),
      categoria:  new FormControl(''),
      idTipoServicio:  new FormControl(''),
      tipoServicio: new FormControl(''),
      detalle: new FormControl(''),
      centroCosto: new FormControl(''),
      numContacto: new FormControl(''),

    })
  }

  ngOnInit(): void {
    this.obtenerDatos();
    this.usuario = this._loginService.obterTokenInfo();

    this.user.name = this.usuario.nombres + ' ' +this.usuario.apellidos;  
    this.user.email =this.usuario.descCargo; 
  
  }



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSourceP.paginator = this.paginator;
    this.dataSourceP.sort = this.sort;
    this.dataSourcePM.paginator = this.paginator;
    this.dataSourcePM.sort = this.sort;
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

  applyFilterPM(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePM.filter = filterValue.trim().toLowerCase();

    if (this.dataSourcePM.paginator) {
      this.dataSourcePM.paginator.firstPage();
    }
  }

  async obtenerDatos(){
   
    this.idSolicitud =  sessionStorage.getItem('idSolicitud');
  
  

    this._solicitudesService.consultaSolicitudDetalle(this.idSolicitud).subscribe(
      (response) =>{

          this.datosFormulario.patchValue({
         
            idSolicitud:        response.data.solicitud.idSolicitud,
            codigoUsuario:      response.data.solicitud.codigoUsuario,
            cedula:             response.data.solicitud.cedula,
            nombres:            response.data.solicitud.nombres,
            codUnidad:          response.data.solicitud.codUnidad,
            unidad:             response.data.solicitud.unidad,
            codUnidadOrg:       response.data.solicitud.codUnidadOrg,
            unidadOrg:          response.data.solicitud.unidadOrg,
            codUnidadJrq:       response.data.solicitud.codUnidadJrq,
            unidadJrq:          response.data.solicitud.unidadJrq,
            ubicacionFisica:    response.data.solicitud.ubicacionFisica,
            fechaCreacion:      response.data.solicitud.fechaCreacion,
            fechaModificacion:  response.data.solicitud.fechaModificacion,
            estatus:            response.data.solicitud.estatus,
            idServicio:         response.data.solicitud.idServicio,
            servicio:           response.data.solicitud.servicio,
            responsable:        response.data.solicitud.responsable,
            codigoUsuarioResp:  response.data.solicitud.codigoUsuarioResp,
            cedulaResp:         response.data.solicitud.cedulaResp,
            nombresResp:        response.data.solicitud.nombresResp,
            codUnidadResp:      response.data.solicitud.codUnidadResp,
            unidadResp:         response.data.solicitud.unidadResp,
            idTarea:            response.data.solicitud.idTarea,
            tarea:              response.data.solicitud.tarea,
            codusuarioGestion:  response.data.solicitud.codusuarioGestion,
            decision:           response.data.solicitud.decision,
            idCategoria:        response.data.solicitud.idCategoria,
            categoria:          response.data.solicitud.categoria,
            idTipoServicio:     response.data.solicitud.idTipoServicio,
            tipoServicio:       response.data.solicitud.tipoServicio,
            detalle:            response.data.solicitud.detalle,           
            centroCosto:        response.data.solicitud.centroCosto,
            numContacto:        response.data.solicitud.numContacto

          }); 
       
    
          if (response.data.formulario != null) {
            this.ELEMENT_DATAP = [];
            this.ELEMENT_DATAP = response.data.formulario.original;
            this.dataSourceP = new MatTableDataSource(this.ELEMENT_DATAP);
           

           
           }

          this.ELEMENT_DATA = [];
this.ELEMENT_DATA =  response.data.detalle
           this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
           this.ngAfterViewInit();

if (this.datosFormulario.value.tarea == "APROBACIÓN AUTORIZADOR (NIVEL 1)" ) {
  this.estareaA =  true;
  this.estareaC = false;
} else {
  this.estareaA =  false;
  this.estareaC = true; 
}


          this._solicitudesService.consultarMetodosAutenticacion().subscribe(
            (response) => {
             
              if(response.estatus == 'SUCCESS'){
                for(const iterator of response.data){
                  this.metodo.push({name: iterator.nombre, id:iterator.idAutenticacion})
               
                }
              }
            
            }
          );
      }
      )
    
  } 

  openDialog(decision: String): void {

          if (!this.radioSelected) {
            this.esValido = true;
            return;
          }
          this.spinner.show();
          this.usuario = this._loginservices.obterTokenInfo();
          
        
    /*       this._solicitudesService.generarToken(this.usuario.codigo,this.radioSelected).subscribe(
            (response) => {
             
              if(response.estatus == 'SUCCESS'){ */
                const dialogRef = this.dialog.open(ModaldecisionesComponent,{
                  data: {  idSolicitud :this.datosFormulario.value.idSolicitud , decision: decision, idTarea: this.datosFormulario.value.idTarea ,tarea: this.datosFormulario.value.tarea, metodo : this.radioSelected,  idTipoServicio :this.datosFormulario.getRawValue().idTipoServicio},
                  disableClose: true,
                });
                
                dialogRef.afterClosed().subscribe(result => {
                  
                });
        /*       }else{
    
                this.toast.error(response.mensaje, '', this.override2);
              }
            
            } *
          );  */
    
    
      
    
      }


}
