import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { servicioGenerales } from 'app/models/infraestructura';
import { ISelect } from 'app/models/login';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Overlay, OverlayRef, ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalConfirmacionComponent } from '../proveduria-solictud-afc/modal-confirmacion/modal-confirmacion.component';
import { DatosSolicitudSgComponent } from './datos-solicitud-sg/datos-solicitud-sg.component';

@Component({
  selector: 'app-infraestructura-servicio-g',
  templateUrl: './infraestructura-servicio-g.component.html',
  styleUrls: ['./infraestructura-servicio-g.component.scss']
})
export class InfraestructuraServicioGComponent implements OnInit {

  usuario = {} as any;
  servicioGenerales = {} as any;
  datosSolicitud= {} as servicioGenerales;

  usuFormulario: FormGroup;
  isShownP: boolean = true; 
  isShownSU: boolean = false;
  isShownPT: boolean = false;
  mostrar: boolean = false;
  
  @Input() id: number;
  
  piso= new FormControl('', Validators.required);
  


    //#region Select

    protected codUnidad : ISelect[] = [];
    public codUnidadCtrl : FormControl = new FormControl();
    public codUnidadFiltrosCtrl : FormControl = new FormControl();
    public filtrocodUnidad : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
   

    protected ubicacion : ISelect[] = [];
    public ubicacionCtrl : FormControl = new FormControl();
    public ubicacionFiltrosCtrl : FormControl = new FormControl();
    public filtroubicacion : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
   
    protected detalleUbicacion : ISelect[] = [];
    public detalleUbicacionCtrl : FormControl = new FormControl();
    public detalleUbicacionFiltrosCtrl : FormControl = new FormControl();
    public filtrodetalleUbicacion : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
     
    protected supervisor : ISelect[] = [];
    public supervisorCtrl : FormControl = new FormControl();
    public supervisorFiltrosCtrl : FormControl = new FormControl();
    public filtrosupervisor : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
       //#endregion

       
//#region toast
override2 = {
  positionClass: 'toast-bottom-full-width',
  closeButton: true,
  
};
//#endregion
protected _onDestroy = new Subject<void>();
//#region  spinner
private overlayRef!: OverlayRef;
//#endregion
  
  //#region  tablas
  displayedColumns: string[] = ['tipoSolicitud','detalleSol','observacion','acciones'];
 
  positionOptions: TooltipPosition[] = ['below'];
  position = new FormControl(this.positionOptions[0]);
   dataSource: MatTableDataSource<servicioGenerales>;
  ELEMENT_DATA: servicioGenerales[] = [];
  
 @ViewChild(MatPaginator) paginator: MatPaginator | any;
 @ViewChild(MatSort) sort: MatSort = new MatSort;  
 @ViewChild(MatTable) table: MatTable<servicioGenerales>; 
  //#endregion


  constructor(private _loginservices: LoginService,
             private _solicitudesService : SolicitudesService,
             private formBuilder : FormBuilder,
             private router: Router,
             private toast: ToastrService,
             private spinner: NgxSpinnerService,
             private overlay: Overlay,
             public dialog: MatDialog,
             ) { 

      // Asi la data a elemento dataSource asi se vacia para su inicializacion
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);  

              this.usuFormulario = formBuilder.group({

                codigoUsuario: new FormControl({value: null, readonly: true}),
                cedula: new FormControl({value: null, readonly: true}),
                nombres: new FormControl({value: null, readonly: true}),
                codUnidad: new FormControl('', [Validators.required] ),
                unidad: new FormControl({value: null, readonly: true}),
                codUnidadOrg:  new FormControl(''),
                unidadOrg: new FormControl(''),
                codUnidadJrq: new FormControl(''),
                unidadJrq: new FormControl(''),
                ubicacionFisica: new FormControl('', [Validators.required]),
                idServicio: new FormControl(''),
                responsable: new FormControl(''),
                codigoUsuarioResp: new FormControl(''),
                cedulaResp: new FormControl(''),
                nombresResp: new FormControl(''),
                codUnidadResp: new FormControl(''),
                unidadResp: new FormControl(''),
                codusuarioGestion:  new FormControl(''),
                centroCosto:  new FormControl(''),
                numContacto : new FormControl('', [Validators.required]),
        
              })

             }

  ngOnInit(): void {
   
   this.obtenerDatos(); 
  //#region select 



 
 
 
  
  this.codUnidadCtrl.setValue(this.codUnidad);
  this.filtrocodUnidad.next(this.codUnidad);
  this.codUnidadFiltrosCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filtrocodUnidadT();
    
  });


   this.ubicacionCtrl.setValue(this.ubicacion);
  this.filtroubicacion.next(this.ubicacion);
  this.ubicacionFiltrosCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filtroUbicacionT();
    
  });
              
              
  this.detalleUbicacionCtrl.setValue(this.detalleUbicacion);
  this.filtrodetalleUbicacion.next(this.detalleUbicacion);
  this.detalleUbicacionFiltrosCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filtrodetalleUbicacionT();
  });
           
  this.supervisorCtrl.setValue(this.supervisor);
  this.filtrosupervisor.next(this.supervisor);
  this.supervisorFiltrosCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filtrosupervisorT();
  });              
  //#endregion
              
                  
              
              
}   


ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}
 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}
 
async obtenerDatos(){
  
  this.usuario = this._loginservices.obterTokenInfo();
    

  this._solicitudesService.consultarDetalleUsuario(this.usuario.codigo).subscribe(
    (data) =>{ 

      if( data.estatus ==  'SUCCESS'  ){
        this.usuFormulario.patchValue({
          codigoUsuario: data.data.codigo,
          cedula: data.data.cedula,
          nombres:   data.data.nombres + ' ' + data.data.apellidos,
          codUnidad: data.data.codUnidad,
          unidad: data.data.descUnidad,
          codusuarioGestion :  data.data.codigoSupervisor ,
          ubicacionFisica: data.data.codUbicacionFisica
        }); 
        this.piso =  new FormControl(data.data.detalleUbicacion)
       
        if (this.usuFormulario.value.ubicacionFisica) {
          this.mostrarInput();
        }

      }
             
    }, 

  );
 
  this._solicitudesService.unidadesJerarguicaDescendente(this.usuario.codUnidad).subscribe(
    (response) => {
 
      this.codUnidad.push({name: 'Selecciones', id:''});
      if(response.estatus == 'SUCCESS'){
        for(const iterator of response.data){
          this.codUnidad.push({name:iterator.codUnidad+ '-' +  iterator.unidad, id:iterator.codUnidad})
        }
       
      }

    }
  );



  this._solicitudesService.ubicacionFisica().subscribe(
    (response) => {
 
      this.ubicacion.push({name: 'Selecciones', id:''});
      if(response.estatus == 'SUCCESS'){
        for(const iterator of response.data){
          this.ubicacion.push({name: iterator.descripcion, id:iterator.codUbicacion})
        }
       
      }
      
    }
  );

  if (this.usuario.nivelCargo < 10 ) {
    this.isShownSU = true;

    this._solicitudesService.obtenerSupervisoresJRQ(this.usuario.codUnidadJrq ,this.usuario.nivelCargo,this.usuario.codigo ).subscribe(
      (response) => {
  
        this.supervisor.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
          for(const iterator of response.data){
            this.supervisor.push({name: iterator.nombres + ' ' +iterator.apellidos , id:iterator.codUsuario})
          }
        }
    
      
        
      }
    );


  }

  


}  



mostrarInput(){

  this._solicitudesService.ubicacionFisicaDetalle(this.usuFormulario.value?.ubicacionFisica).subscribe(
     (response) => {
      
      this.detalleUbicacion.length = 0;
 
       this.detalleUbicacion.push({name: 'Selecciones', id:''});
       if(response.estatus == 'SUCCESS'){
 
         for(const iterator of response.data){
         
           if (this.usuFormulario.value?.ubicacionFisica == "OFICINA" || this.usuFormulario.value?.ubicacionFisica == "SUC") {
        
             this.detalleUbicacion.push({name:iterator.codDetalle +'-'+ iterator.detalle, id:iterator.codDetalle})
           } else {
             this.detalleUbicacion.push({name:iterator.detalle, id:iterator.codDetalle})
           }
         }
        
   
           this.isShownP = true;
           this.isShownPT = false;
       
 
       }else {
         this.isShownP = false;
         this.isShownPT = true;
       }
       
     }
   );
  }
 



  nextId :any = 1;
  openDialog(): void {

    const dialogRef = this.dialog.open(DatosSolicitudSgComponent,{

      width: '50%',
      disableClose: true
    })
    
    dialogRef.afterClosed().subscribe(result => {

 if (result) {


  const  indicec = this.dataSource.data.filter(elemento => elemento.idDetalleSol === result.idDetalleSol);


  if (indicec.length >  0) {






      this.toast.error(result.detalleSol + ' ya asignado' , '', this.override2);



   
    
  } else {

  
      
 

      result.relacion = this.nextId;
   
      this.dataSource.data.push(result); 
      this.dataSource.data = this.dataSource.data.slice();
      this.ngAfterViewInit();
      this.nextId++;
 

  
  }
} 

     
    });
  
    
  
  }


  openDialogEdit(row: any): void {

    const dialogRef = this.dialog.open(DatosSolicitudSgComponent,{
      data: {solicitud : row},
      width: '50%',
      disableClose: true
    })
    
    dialogRef.afterClosed().subscribe(result => {

if (result) {



 
  const  indice = this.dataSource.data.findIndex(elemento => elemento.relacion === result.relacion);


  this.dataSource.data[indice] = result;

   this.ngAfterViewInit();
}

     
    });
  
    
  
  }
  deleteRow(rowToDelete: any) {
    // Assuming 'id' is the unique identifier property

    
    const filteredData = this.dataSource.data.filter(row => row.relacion !== rowToDelete.relacion);
    this.dataSource.data = filteredData;
  
    // Optional: Send delete request to server or show confirmation message
   
  }

  async submit(){
    if(this.usuFormulario.valid){
          /*    this.spinner.show('sp1'); */
          
        
        
        
          if (this.dataSource.data.length > 0 ) {
        
        
        
            this.usuario = this._loginservices.obterTokenInfo();
          
          
          this._solicitudesService.consultarDetalleUsuario(this.usuFormulario.value.codigoUsuario).subscribe(
            (data) =>{ 
          
              if( data.estatus ==  'SUCCESS'  ){
                this.usuFormulario.patchValue({
                  
                  codUnidadOrg: data.data.codUnidadOrg,
                  unidadOrg: data.data.unidadOrg,
                  codUnidadJrq: data.data.codUnidadJrq,
                  unidadJrq: data.data.unidadJrq
                  
          
                }); 
           
           
          var piso;
          
                if (this.isShownP == true) {
                  
                 piso =  document.querySelector('#selectpiso')?.textContent
          
                } else {
                  piso =  this.piso.value
                }
          
          
          if (this.usuario.nivelCargo < 9) {
          
            if ( this.usuFormulario.value.codusuarioGestion == '') {
             
              this.usuFormulario = this.formBuilder.group({
          
                codusuarioGestion:  new FormControl('',  [Validators.required]),
          
              })
            
              return false;
            }
          }
   
          
                this.usuFormulario.value.ubicacionFisica = document.querySelector('#selectUbi')?.textContent + "-" + piso;
                this.usuFormulario.value.idServicio =  sessionStorage.getItem('idServicio');
                this.usuFormulario.value.codigoUsuarioResp = this.usuario.codigo;
                this.usuFormulario.value.cedulaResp =  this.usuario.cedula;
                this.usuFormulario.value.nombresResp = this.usuario.nombres + ' ' + this.usuario.apellidos;
                this.usuFormulario.value.codUnidadResp = this.usuario.codUnidad;
                this.usuFormulario.value.unidadResp =this.usuario.descUnidad;
                this.usuFormulario.value.codusuarioGestion =  this.usuFormulario.value.codusuarioGestion;
                
                
        var formulario = []; 
        
           this.dataSource.data.forEach(element => {
        
        
            this.datosSolicitud = {} as servicioGenerales;
            this.datosSolicitud.idTipoSolicitud =        element.idTipoSolicitud       ;
            this.datosSolicitud.tipoSolicitud =          element.tipoSolicitud    ;
            this.datosSolicitud.idDetalleSol =      element.idDetalleSol     ;
            this.datosSolicitud.detalleSol =       element.detalleSol      ;
            this.datosSolicitud.observacion  =  element.observacion  ;
            this.datosSolicitud.requiereAprobacion  =     element.requiereAprobacion     ;
            this.datosSolicitud.tiempoRespuestaNum =      element.tiempoRespuestaNum     ;
            this.datosSolicitud.tiempoRespuesta =    element.tiempoRespuesta   ;
            this.datosSolicitud.evento =      element.evento     ;
        
        
        
        
            formulario.push(this.datosSolicitud)
        
           }) 
        
        
               var enviarData = {};
              enviarData= {
                "creacion":this.usuFormulario.value,
                "formulario":formulario
               } 
             
       
               const dialogRef = this.dialog.open(ModalConfirmacionComponent,{
                data: {enviarData},
                width: '40%',
                disableClose: true
              })
               
                  
    
                
                dialogRef.afterClosed().subscribe(result => {
    
    
                
                });
      
           
              }else{
                this.toast.error(data.mensaje, '', this.override2);
              }
                     
            }, 
          
          );
          
          
          }else{
        
            this.toast.error('Disculpe, debe agregar un tipo de solicitud', '' , this.override2);
           
          }
        
          
              
           }else{
             
            
              this.toast.error('Disculpe, debe llenar todos los campos obligatorios de cada sección', '' , this.override2);
           }
    
      } 
 
  
  redirigirSuccess(){
  
    this.router.navigate(['/solicitudes/gestionarSolicitudes']);
  }
  
 //#region  inicializador de select

 



 protected filtrocodUnidadT() {
  if (!this.codUnidad) {
    return;
  }
  // get the search keyword
  let search = this.codUnidadFiltrosCtrl.value;
  if (!search) {
    this.filtrocodUnidad.next(this.codUnidad.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtrocodUnidad.next(
    this.codUnidad.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
  );
}

 protected filtroUbicacionT() {
  if (!this.ubicacion) {
    return;
  }
  // get the search keyword
  let search = this.ubicacionFiltrosCtrl.value;
  if (!search) {
    this.filtroubicacion.next(this.ubicacion.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtroubicacion.next(
    this.ubicacion.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
  );
}



protected filtrodetalleUbicacionT() {
  if (!this.detalleUbicacion) {
    return;
  }
  // get the search keyword
  let search = this.detalleUbicacionFiltrosCtrl.value;
  if (!search) {
    this.filtrodetalleUbicacion.next(this.detalleUbicacion.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtrodetalleUbicacion.next(
    this.detalleUbicacion.filter(tipo => tipo.name.toLowerCase().indexOf(search) > -1)
  );
}


protected filtrosupervisorT() {
  if (!this.supervisor) { 
    return;
  }
  // get the search keyword
  let search = this.supervisorFiltrosCtrl.value;
  if (!search) {
    this.filtrosupervisor.next(this.supervisor.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtrosupervisor.next(
    this.supervisor.filter(tipo => tipo.name.toLowerCase().indexOf(search) > -1)
  );
}


//#endregion

}
