import { Component, OnInit, ViewChild } from '@angular/core';
import { ModaldecisionesComponent } from '../../solicitudes/modaldecisiones/modaldecisiones.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { LoginService } from 'app/services/login.service';
import { Subject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { solicitudesDto } from 'app/models/usuario';
import { TooltipPosition } from '@angular/material/tooltip';
import { articulo } from 'app/models/proveduria';
import { User } from 'app/core/user/user.types';
import { DatosArticulosSolicitarComponent } from '../../solicitudes/crear/proveduria-solictud-afc/datos-articulos-solicitar/datos-articulos-solicitar.component';


@Component({
  selector: 'app-detalle-solicitud-proveduria',
  templateUrl: './detalle-solicitud-proveduria.component.html',
  styleUrls: ['./detalle-solicitud-proveduria.component.scss']
})
export class DetalleSolicitudProveduriaComponent implements OnInit {

  user = {} as User;
  solicitudesDto = {} as any;
  usuario = {} as any;
  datosFormulario: FormGroup;  
  idSolicitud : any;
  servicioA: boolean = false;
  servicioR: boolean = false;
  serviA: boolean = false;
  mensaje: any;
  articulo = {} as any;
 
datosArticulo = {} as articulo;
  esValido:  boolean = false;
  hasError :boolean = false;
  estareaA :boolean = false;
  estareaC :boolean = false;
  isShownD: boolean = false;
  metodo = [];
  ticket = new FormControl('');
  radioSelected: any;
    //#region  tablas
    displayedColumnsP: string[] = [];
    positionOptionsP: TooltipPosition[] = ['below'];
    positionP = new FormControl(this.positionOptionsP[0]);
    dataSourceP: MatTableDataSource<articulo>;
    ELEMENT_DATAP: articulo[] = [];


    displayedColumns: string[] = ['nombreTarea', 'codUsuarioInicio', 'nombreUsuarioInicio', 'fechaInicio', 'codUsuarioFin', 'nombreUsuarioFin', 'fechaFin','decision', 'motivo', 'observacion'];
    positionOptions: TooltipPosition[] = ['below'];
     position = new FormControl(this.positionOptions[0]);
     dataSource: MatTableDataSource<solicitudesDto>;   
     ELEMENT_DATA: solicitudesDto[] = [];

   @ViewChild(MatPaginator) paginator: MatPaginator | any;
   @ViewChild(MatSort) sort: MatSort = new MatSort;  
   @ViewChild(MatTable) tableP: MatTable<articulo>; 
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

/*     if (this.datosFormulario.value.idServicio == 4) {
    
      this.displayedColumnsP.push('tipoArt', 'dercripciónArt', 'cantidadArt','unidadVenta','acciones')
    } else {
      this.displayedColumnsP.push('tipoArt','direccionIp','tipoImpresora', 'dercripciónArt','descConsumible' ,'modeloConsumible','unidadVenta',  'cantidadArt', 'acciones')
    } */
    this.usuario = this._loginService.obterTokenInfo();

    this.user.name = this.usuario.nombres + ' ' +this.usuario.apellidos;  
    this.user.email =this.usuario.descCargo; 
  
  }



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSourceP.paginator = this.paginator;
    this.dataSourceP.sort = this.sort;
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
          this.ELEMENT_DATAP = []; 
          this.serviA = true;
          
    if (this.datosFormulario.value.idServicio == 4) {
   
      this.displayedColumnsP.push('tipoArt', 'dercripciónArt', 'cantidadArt','unidadVenta','observacion','acciones')
    } else {
      this.displayedColumnsP.push('tipoArt','direccionIp','tipoImpresora', 'dercripciónArt','descConsumible' ,'modeloConsumible', 'cantidadArt','unidadVenta', 'observacion', 'acciones')
    }


    if (response.data.formulario != null) {
     
      this.ELEMENT_DATAP = response.data.formulario.gestion;
      this.dataSourceP = new MatTableDataSource(this.ELEMENT_DATAP);
      this.ngAfterViewInit();
     }

          this.ELEMENT_DATA = [];
          this.ELEMENT_DATA =  response.data.detalle
           this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
           this.ngAfterViewInit();
    

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

  openDialogEdit(row: any): void {

    sessionStorage.setItem('idServicio', this.datosFormulario.value.idServicio);

    const dialogRef = this.dialog.open(DatosArticulosSolicitarComponent,{
      data: {articulo : row},
      width: '50%',
      disableClose: true
    })
    
    dialogRef.afterClosed().subscribe(result => {

if (result) {



 
  const  indice = this.dataSourceP.data.findIndex(elemento => elemento.relacion === result.relacion);


  this.dataSourceP.data[indice] = result;

   this.ngAfterViewInit();
}

     
    });
  
    
  
  }
  openDialog(decision: String): void {
  
      
    
      const dialogRef = this.dialog.open(ModaldecisionesComponent,{
        data: {  idSolicitud :this.datosFormulario.value.idSolicitud , decision: decision, idTarea: this.datosFormulario.value.idTarea , metodo : 'buzon', formulario : this.dataSourceP.data,   idTipoServicio :this.datosFormulario.getRawValue().idTipoServicio , nroticket: this.ticket.value},
        disableClose: true,
      });
      
      dialogRef.afterClosed().subscribe(result => {
      
      });
    
    }


}

