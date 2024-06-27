import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { servicioGenerales } from 'app/models/infraestructura';
import { solicitudesDto } from 'app/models/usuario';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-detalle-sol-serv-generales',
  templateUrl: './detalle-sol-serv-generales.component.html',
  styleUrls: ['./detalle-sol-serv-generales.component.scss']
})
export class DetalleSolServGeneralesComponent implements OnInit {

  user = {} as User;
  solicitudesDto = {} as any;
  usuario = {} as any;
  datosFormulario: FormGroup;  
  idSolicitud : any;
  servicioP: boolean = false;
  mensaje: any;
  //#region  tablas
  displayedColumns: string[] = ['nombreTarea', 'codUsuarioInicio', 'nombreUsuarioInicio', 'fechaInicio', 'codUsuarioFin', 'nombreUsuarioFin', 'fechaFin','decision', 'motivo', 'observacion'];
  positionOptions: TooltipPosition[] = ['below'];
   position = new FormControl(this.positionOptions[0]);
   dataSource: MatTableDataSource<solicitudesDto>;   
   ELEMENT_DATA: solicitudesDto[] = [];

 
    displayedColumnsE: string[] = ['tipoSolicitud','detalleSol','observacion'];
    positionOptionsE: TooltipPosition[] = ['below'];
     positionE = new FormControl(this.positionOptionsE[0]);
     dataSourceE: MatTableDataSource<servicioGenerales>;    
     ELEMENT_DATAE: servicioGenerales[] = [];
    
     displayedColumnsR: string[] = ['tipoSolicitud','detalleSol','observacion'];
     positionOptionsR: TooltipPosition[] = ['below'];
      positionR = new FormControl(this.positionOptionsR[0]);
      dataSourceR: MatTableDataSource<servicioGenerales>;     
      ELEMENT_DATAR: servicioGenerales[] = [];
    
     @ViewChild(MatPaginator) paginator: MatPaginator | any;
     @ViewChild(MatSort) sort: MatSort = new MatSort;  
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
              private _router: Router) {

                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA); 
                this.dataSourceE = new MatTableDataSource(this.ELEMENT_DATAE);
                this.dataSourceR = new MatTableDataSource(this.ELEMENT_DATAR); 
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
    this.dataSourceE.paginator = this.paginator;
    this.dataSourceE.sort = this.sort;
    this.dataSourceR.paginator = this.paginator;
    this.dataSourceR.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

   
  }

  applyFilterE(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceE.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceE.paginator) {
      this.dataSourceE.paginator.firstPage();
    }
  }

  applyFilterR(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
   
    this.dataSourceR.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceR.paginator) {
      this.dataSourceR.paginator.firstPage();
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
            detalle:            response.data.solicitud.detalle           
    
          }); 
          
    
        
          this.ELEMENT_DATA = [];
          this.ELEMENT_DATA = response.data.detalle;
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.ngAfterViewInit();
       
     debugger
          if (response.data.formulario != null) {
       
           
            this.ELEMENT_DATAR = [];
            this.ELEMENT_DATAR = response.data.formulario.original;
            this.dataSourceR = new MatTableDataSource(this.ELEMENT_DATAR);

            if (this.datosFormulario.value.idTarea == 20) {
              this.servicioP = true;
              this.ELEMENT_DATAE = [];
              this.ELEMENT_DATAE = response.data.formulario.gestion;
              this.dataSourceE = new MatTableDataSource(this.ELEMENT_DATAE);
          
    
            }
           
           }
      }
      )
    
  } 

  
}
