import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, OnInit, ViewChild,   } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentPortal } from '@angular/cdk/portal';
import {TooltipPosition} from '@angular/material/tooltip';

import {MatTableDataSource} from '@angular/material/table';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import {  usuario } from 'app/models/usuario';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DatosAsignadoComponent } from '../datos-asignado/datos-asignado.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerComponent } from 'app/modules/admin/spinner/spinner.component';
import { ISelect, ISelectEquipo } from 'app/models/login';
import {  ReplaySubject, Subject } from 'rxjs';
import {  takeUntil } from 'rxjs/operators';


//1 iniciamos el objecto a llenar la tabla vacio
 

@Component({
  selector: 'app-requerimiento-equipo-asignacion',
  templateUrl: './requerimiento-equipo-asignacion.component.html',
  styleUrls: ['./requerimiento-equipo-asignacion.component.scss']
 
})


export class RequerimientoEquipoAsignacionComponent implements OnInit, AfterViewInit {
  selectedOption: string;
  usuario = {} as any;
  usuFormulario: FormGroup;
  plantillaUsuario = {} as usuario;
  equipos  = new FormControl('', Validators.required);

  piso= new FormControl('', Validators.required);
 

   //#region  tablas
   displayedColumns: string[] = ['codUsuario', 'cedula', 'nombres', 'codUnidad', 'unidad', 'codCargo', 'cargo', 'acciones'];
   positionOptions: TooltipPosition[] = ['below'];
   position = new FormControl(this.positionOptions[0]);
   dataSource: MatTableDataSource<usuario>;
   ELEMENT_DATA: usuario[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort;  
   //#endregion


    //#region Select de ubicacion
  protected ubicacion : ISelect[] = [];
  public ubicacionCtrl : FormControl = new FormControl();
  public ubicacionFiltrosCtrl : FormControl = new FormControl();
  public filtroubicacion : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
  //#endregion

  //#region Select de equipo
  protected equipo : ISelectEquipo[] = [];
  public equipoCtrl : FormControl = new FormControl();
  public equipoFiltrosCtrl : FormControl = new FormControl();
  public filtroequipo : ReplaySubject<ISelectEquipo[]> = new ReplaySubject<ISelectEquipo[]>(1);
  //#endregion

    //#region Select de detalle ubicacion
    protected detalleUbicacion : ISelect[] = [];
    public detalleUbicacionCtrl : FormControl = new FormControl();
    public detalleUbicacionFiltrosCtrl : FormControl = new FormControl();
    public filtrodetalleUbicacion : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
    //#endregion

     //#region Select de tipo supervisor
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
  
  constructor(public dialog: MatDialog,
              private _loginservices: LoginService,
              private _solicitudesService : SolicitudesService,
              private formBuilder : FormBuilder,
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private cdRef : ChangeDetectorRef,
              private overlay: Overlay,
              /* private spinner: NgxSpinnerService */) {


      // Asi la data a elemento dataSource asi se vacia para su inicializacion
       this.dataSource = new MatTableDataSource(this.ELEMENT_DATA); 

      this.usuFormulario = formBuilder.group({

        codigoUsuario: new FormControl({value: null, readonly: true}),
        cedula: new FormControl({value: null, readonly: true}),
        nombres: new FormControl({value: null, readonly: true}),
        codUnidad: new FormControl({value: null, readonly: true}),
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
        detalle : new FormControl('', [Validators.required]),
        numContacto : new FormControl('', [Validators.required]),

      })
    }


   



  ngOnInit(): void {
/*    
    this.spinner.show('sp1');
     */

//#region select de detalleUbicacion



this.ubicacionCtrl.setValue(this.ubicacion);
this.filtroubicacion.next(this.ubicacion);
this.ubicacionFiltrosCtrl.valueChanges
.pipe(takeUntil(this._onDestroy))
.subscribe(() => {
  this.filtroUbicacionT();
  
});


this.equipoCtrl.setValue(this.equipo);
this.filtroequipo.next(this.equipo);
this.equipoFiltrosCtrl.valueChanges
.pipe(takeUntil(this._onDestroy))
.subscribe(() => {
  this.filtroEquipoT();
  
});

    this.detalleUbicacionCtrl.setValue(this.detalleUbicacion);
    this.filtrodetalleUbicacion.next(this.detalleUbicacion);
    this.detalleUbicacionFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtrodetalleUbicacionT();
    });
//#endregion

//#region select de supervisor
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

isShownP: boolean = true; 
isShown: boolean = false; 
isShownT: boolean = false;
isShownSU: boolean = false;
isShownPT: boolean = false;


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


handleRadioChange(event: MatRadioChange): void {
  this.selectedOption = event.value; // Actualiza la propiedad con el valor seleccionado
 

  if (this.selectedOption == 'Y') {
    
    this.isShown = true;
    this.isShownT = false;
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

        }else{
          
        }
               
      }, 

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

    
      this._solicitudesService.consultarTipoEquipo().subscribe(
        (response) => {
          this.equipo.push({tipoEquipo: 'EQUIPO COMPLETO', idTipoEquipo: '0'});
          if(response.estatus == 'SUCCESS'){
            for(const iterator of response.data){
              this.equipo.push({tipoEquipo: iterator.nombre,  idTipoEquipo:iterator.idTipoEquipo})
            }
          }
          
        }
      );
    
    if (this.usuario.nivelCargo < 11 ) {
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
    

    
  

  } else {
    this.isShownT = true;
    this.isShown = false;
    this.obtenerPlantilla();
  }




}





async submit(){
  if(this.usuFormulario.valid){
/*    this.spinner.show('sp1'); */

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



if (this.usuario.nivelCargo < 11) {

  if ( this.usuFormulario.value.codusuarioGestion == '') {
   
    this.usuFormulario = this.formBuilder.group({

      codusuarioGestion:  new FormControl('',  [Validators.required]),

    })
  
    return false;
  }
}


      this.usuFormulario.value.ubicacionFisica = document.querySelector('#selectUbi')?.textContent + "-" + piso;
      this.usuFormulario.value.responsable = this.selectedOption;
      this.usuFormulario.value.idServicio =  sessionStorage.getItem('idServicio');
      this.usuFormulario.value.codigoUsuarioResp = this.usuario.codigo;
      this.usuFormulario.value.cedulaResp =  this.usuario.cedula;
      this.usuFormulario.value.nombresResp = this.usuario.nombres + ' ' + this.usuario.apellidos;
      this.usuFormulario.value.codUnidadResp = this.usuario.codUnidad;
      this.usuFormulario.value.unidadResp =this.usuario.descUnidad;
      this.usuFormulario.value.codusuarioGestion =  this.usuFormulario.value.codusuarioGestion;

     var enviarData = {};
     enviarData= {
      "creacion":this.usuFormulario.value,
      "formulario":this.equipos.value
     }

        this._solicitudesService.crear(enviarData).subscribe(
        (data) =>{    
         if(data.estatus == "SUCCESS"){
            this.toast.success(data.mensaje, '', this.override2);            
            setTimeout(()=>{
              this.redirigirSuccess();
          },1500);  
          }else{
            this.toast.error(data.mensaje, '', this.override2);
          }
          this.spinner.hide();
       this.spinner.hide('sp1'); 
              }, 
        (error) =>{
          this.toast.error(data.mensaje, '', this.override2);
        }
      );  
 
    }else{
      this.toast.error(data.mensaje, '', this.override2);
    }
           
  }, 

);


    
 }else{
   
  
    this.toast.error('Disculpe, debe llenar todos los campos obligatorios de cada sección', '' , this.override2);
 }

}

// llamamos al llenado de la tabla
obtenerPlantilla(){
  this.usuario = this._loginservices.obterTokenInfo();
  this._solicitudesService.consultarobtenerPlantilla(this.usuario.codigo, this.usuario.codUnidad).subscribe(
  (response) =>{
    
      this.ELEMENT_DATA = [];
      for(const iterator of response.usuariosLts){
        this.plantillaUsuario =  {} as usuario;
       this.plantillaUsuario.codUsuario = iterator.codigo;
       this.plantillaUsuario.cedula = iterator.cedula;
       this.plantillaUsuario.nombres = iterator.nombres + ' ' + iterator.apellidos;
       this.plantillaUsuario.codUnidad = iterator.codUnidad;
       this.plantillaUsuario.unidad = iterator.descUnidad;
       this.plantillaUsuario.codCargo = iterator.codigoCargo;
       this.plantillaUsuario.cargo = iterator.descCargo;
       this.ELEMENT_DATA.push(this.plantillaUsuario);
      }
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.ngAfterViewInit();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }
  )
}

openDialog(codUsuarioI : string) {
  debugger
  const dialogRef = this.dialog.open(DatosAsignadoComponent,{
    data: { codUsuario :  codUsuarioI},
    disableClose: true,
  });
  
  dialogRef.afterClosed().subscribe(result => {
    
  });
}








redirigirSuccess(){
  
  this.router.navigate(['/solicitudes/gestionarSolicitudes']);
}

public show(message = '') {
  // Returns an OverlayRef (which is a PortalHost)

  if (!this.overlayRef) {
    this.overlayRef = this.overlay.create();
  }

  // Create ComponentPortal that can be attached to a PortalHost
  const spinnerOverlayPortal = new ComponentPortal(SpinnerComponent);
  const component = this.overlayRef.attach(spinnerOverlayPortal); // Attach ComponentPortal to PortalHost
}

 validarVariable(variable: any): boolean {
  return variable !== null && variable !== undefined && variable !== '';
}


 //#region  inicializador de select
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

protected filtroEquipoT() {
  if (!this.equipo) {
    return;
  }
  // get the search keyword
  let search = this.equipoFiltrosCtrl.value;
  if (!search) {
    this.filtroequipo.next(this.equipo.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtroequipo.next(
    this.equipo.filter(cargo => cargo.tipoEquipo.toLowerCase().indexOf(search) > -1)
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
