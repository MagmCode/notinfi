import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { ISelect } from 'app/models/login';
import { equipoDto, solicitudesDto } from 'app/models/usuario';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModaldecisionesComponent } from '../modaldecisiones/modaldecisiones.component';
import { MatDialog } from '@angular/material/dialog';
import { forEach } from 'lodash';

@Component({
  selector: 'app-decision-solicitud',
  templateUrl: './decision-solicitud.component.html',
  styleUrls: ['./decision-solicitud.component.scss']
})
export class DecisionSolicitudComponent implements OnInit {

  user = {} as User;
  solicitudesDto = {} as any;
  usuario = {} as any;
  datosFormulario: FormGroup;  
  idSolicitud : any;
  idTarea: any;
  metodo = [];
  radioSelected: any;
  equipo: any;
  servicioA: boolean = false;
  serviA: boolean = false;
  serviR: boolean = false;
  servicioR: boolean = false;
  mensaje: any;

  //#region  tablas
  displayedColumns: string[] = ['nombreTarea', 'codUsuarioInicio', 'nombreUsuarioInicio', 'fechaInicio', 'codUsuarioFin', 'nombreUsuarioFin', 'fechaFin','decision', 'motivo', 'observacion'];
  positionOptions: TooltipPosition[] = ['below'];
   position = new FormControl(this.positionOptions[0]);
   dataSource: MatTableDataSource<solicitudesDto>;    
   
   ELEMENT_DATA: solicitudesDto[] = [];


   displayedColumnsE: string[] = ['tipoEquipo','serial', 'marca', 'modelo', 'bienNacional'];
   positionOptionsE: TooltipPosition[] = ['below'];
    positionE = new FormControl(this.positionOptionsE[0]);
    dataSourceE: MatTableDataSource<equipoDto>;     
    ELEMENT_DATAE: equipoDto[] = [];

    displayedColumnsR: string[] = ['tipoEquipo','serial', 'marca', 'modelo', 'bienNacional'];
     positionOptionsR: TooltipPosition[] = ['below'];
      positionR = new FormControl(this.positionOptionsR[0]);
      dataSourceR: MatTableDataSource<equipoDto>;     
      ELEMENT_DATAR: equipoDto[] = [];
    
    
   @ViewChild(MatPaginator) paginator: MatPaginator | any;
   @ViewChild(MatSort) sort: MatSort = new MatSort;  
  //#endregion

 
  esValido:  boolean = false;
  hasError :boolean = false;
  estareaA :boolean = false;
  estareaC :boolean = false;

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
                   metodos:  new FormControl('',  [Validators.required]),
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
    this.dataSource.filter = filterValue.trim().toLowerCase();

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
            tipoServicio:       response.data.solicitud.tipoServicio ,
            detalle:            response.data.solicitud.detalle           
    
          });  
        
          if (this.datosFormulario.value.idTarea == "2" || this.datosFormulario.value.idTarea == "3") {
            
            this.estareaA =  true;
            this.estareaC = false;
            this.equipo = '';
            response.data.formulario.forEach(element => {
              if (this.equipo == '') {
                this.equipo =  element.tipoEquipo ;
              } else {
                this.equipo +=  ', '+element.tipoEquipo ;
              }
            
              });

          } else {
            this.estareaA =  false;
            this.estareaC = true;

            this.ELEMENT_DATAE = [];
              if (this.datosFormulario.value.idServicio == 1) {
                this.ELEMENT_DATAE = response.data.formulario;
            
                this.servicioR = false;
                
            this.mensaje='Detalle de los equipos'

              } else {
                this.ELEMENT_DATAE = response.data.formulario.nuevoEquipo;
                this.servicioR = true;
                this.mensaje='Detalle de los equipos nuevos'
           
              this.ELEMENT_DATAR = [];
              this.ELEMENT_DATAR = response.data.formulario.reposicion;
              this.dataSourceR = new MatTableDataSource(this.ELEMENT_DATAR);
              this.ngAfterViewInit();
              this.dataSourceR.paginator = this.paginator;
              this.dataSourceR.sort = this.sort;
                
              }
      
          }

     
          this.dataSourceE = new MatTableDataSource(this.ELEMENT_DATAE);
          this.ngAfterViewInit();
          this.dataSourceE.paginator = this.paginator;
          this.dataSourceE.sort = this.sort;
          this.ELEMENT_DATA = [];
          this.ELEMENT_DATA = response.data.detalle;
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
          this.ngAfterViewInit();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

      

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
  


    const dialogRef = this.dialog.open(ModaldecisionesComponent,{
      data: {  idSolicitud :this.datosFormulario.value.idSolicitud , decision: decision, idTarea: this.datosFormulario.value.idTarea , metodo : this.radioSelected},
      disableClose: true,
    });
    
    dialogRef.afterClosed().subscribe(result => {
      
    });

  }





}
