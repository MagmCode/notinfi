import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ISelect } from 'app/models/login';
import { equipoDto, usuario } from 'app/models/usuario';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpinnerComponent } from 'app/modules/admin/spinner/spinner.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
@Component({
  selector: 'app-datos-reposicion',
  templateUrl: './datos-reposicion.component.html',
  styleUrls: ['./datos-reposicion.component.scss']
})
export class DatosReposicionComponent implements OnInit {

  usuario = {} as any;
  datosFormulario: FormGroup;
  public codUsuario!: usuario;
  selectedOption: string;
  piso = new FormControl('', Validators.required);
  equipos  = new FormControl('', Validators.required);


  //#region toast
override2 = {
  positionClass: 'toast-bottom-full-width',
  closeButton: true,
  
};
//#endregion

    //#region Select 
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
       
       protected _onDestroy = new Subject<void>();
  //#region  spinner
private overlayRef!: OverlayRef;
//#endregion
 //#region  tablas
displayedColumnsE: string[] = ['select','tipoEquipo','serial', 'marca', 'modelo',  'bienNacional'];
positionOptionsE: TooltipPosition[] = ['below'];
positionE = new FormControl(this.positionOptionsE[0]);
dataSourceE: MatTableDataSource<equipoDto>;    
selection = new SelectionModel<equipoDto>(true, []);

ELEMENT_DATAE: equipoDto[] = [];
@ViewChild(MatPaginator) paginator: MatPaginator | any;
@ViewChild(MatSort) sort: MatSort = new MatSort; 
 //#endregion
 
  constructor(public dialogRef: MatDialogRef<DatosReposicionComponent>,
             @Inject(MAT_DIALOG_DATA) public data: usuario,
              private _loginservices: LoginService,
              private _solicitudesService : SolicitudesService,
              private formBuilder : FormBuilder,
              private overlay: Overlay,              
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private cdRef : ChangeDetectorRef,) { 

                this.codUsuario = data;
                this.dataSourceE = new MatTableDataSource(this.ELEMENT_DATAE); 
              
                this.datosFormulario = formBuilder.group({

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
                  detalle: new FormControl('', [Validators.required]),
                  numContacto : new FormControl('', [Validators.required]),
                })
          }

  ngOnInit(): void {
    
    
//#region select
  this.obtenerDatos();
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
    this.dataSourceE.paginator = this.paginator;
    this.dataSourceE.sort = this.sort;
  }

  applyFilterE(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceE.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSourceE.paginator) {
      this.dataSourceE.paginator.firstPage();
    }
  }
  isShownP: boolean = true; // Inicialmente oculto
isShownPT : boolean = false;

isShownSU: boolean = false;


isAllSelected() {
  const numSelected = this.selection.selected.length;
  const numRows = this.dataSourceE.data.length;
  return numSelected === numRows;
}
masterToggle() {
  if (this.isAllSelected()) {
    this.selection.clear();
    return;
  }

  this.selection.select(...this.dataSourceE.data);
}
checkboxLabel(row?: equipoDto): string {
  if (!row) {
    return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.idEquipo + 1}`;
}

  async obtenerDatos(){

    this.usuario = this._loginservices.obterTokenInfo();
 

    this._solicitudesService.consultarDetalleUsuario(this.codUsuario.codUsuario).subscribe(
      (data) =>{ 
           
        if(typeof data.data !=  'undefined'  ){
          this.datosFormulario.patchValue({
            codigoUsuario: data.data.codigo,
            cedula: data.data.cedula,
            nombres:   data.data.nombres + ' ' + data.data.apellidos,
            codUnidad: data.data.codUnidad,
            unidad: data.data.descUnidad,
            codusuarioGestion : this.usuario.codigoSupervisor,
            ubicacionFisica: data.data.codUbicacionFisica

          }); 

          this.piso =  new FormControl(data.data.detalleUbicacion)
      
          if (this.datosFormulario.value.ubicacionFisica) {
            this.mostrarInput();
          }
        }else{
          
        }
               
      },

    );
    
 /*    this._solicitudesService.consultarEquipoPorUsuario(this.codUsuario.codUsuario).subscribe(
      (response) => {
        if(response.estatus == 'SUCCESS'){
         
          this.ELEMENT_DATAE = [];
          this.ELEMENT_DATAE = response.data;
          this.dataSourceE = new MatTableDataSource(this.ELEMENT_DATAE);
          this.ngAfterViewInit();
          this.dataSourceE.paginator = this.paginator;
          this.dataSourceE.sort = this.sort;
          
        }
        
      } ); */

     
    this._solicitudesService.ubicacionFisica().subscribe(
      (response) => {
    
        this.ubicacion.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
          for(const iterator of response.data){
            this.ubicacion.push({name: iterator.descripcion, id:iterator.codUbicacion})
          }
        }
        
      } );

 
  
 /*  if (this.usuario.nivelCargo < 11 ) {
 
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
  } */
  } 


  
  mostrarInput(){

         
  
  
    this._solicitudesService.ubicacionFisicaDetalle(this.datosFormulario.value?.ubicacionFisica).subscribe(
      (response) => {
       
       this.detalleUbicacion.length = 0;
  
        this.detalleUbicacion.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
  
          for(const iterator of response.data){
  
            if (this.datosFormulario.value?.ubicacionFisica.id == "OFICINA" || this.datosFormulario.value?.ubicacionFisica.id == "SUC") {
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

  async submit(){
    if(this.datosFormulario.valid){
  /*    this.spinner.show('sp1'); */
  
  this.usuario = this._loginservices.obterTokenInfo();


  this._solicitudesService.consultarDetalleUsuario(this.datosFormulario.value.codigoUsuario).subscribe(
    (data) =>{ 
        
      if(typeof data.data !=  'undefined'  ){
        this.datosFormulario.patchValue({
          
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

      /* if (this.usuario.nivelCargo < 11) {
    
        if ( this.datosFormulario.value.codusuarioGestion == undefined) {
         
          this.datosFormulario = this.formBuilder.group({
      
            codusuarioGestion:  new FormControl('',  [Validators.required]),
      
          })
        
          return false;
        }
      } */



        this.datosFormulario.value.ubicacionFisica = document.querySelector('#selectUbi')?.textContent + "-" + piso;
        this.datosFormulario.value.responsable = 'N';
        this.datosFormulario.value.idServicio = sessionStorage.getItem('idServicio');
        this.datosFormulario.value.codigoUsuarioResp = this.usuario.codigo;
        this.datosFormulario.value.cedulaResp =  this.usuario.cedula;
        this.datosFormulario.value.nombresResp = this.usuario.nombres + ' ' + this.usuario.apellidos;
        this.datosFormulario.value.codUnidadResp = this.usuario.codUnidad;
        this.datosFormulario.value.unidadResp =this.usuario.descUnidad;
        this.datosFormulario.value.codusuarioGestion =  this.datosFormulario.value.codusuarioGestion;

  
        var enviarData = {};
        enviarData= {
         "creacion":this.datosFormulario.value,
         "formulario":[]
        }
        
        
    this._solicitudesService.crear(enviarData).subscribe(
    (data) =>{    
     
      if(data.estatus == "SUCCESS"){
        this.toast.success(data.mensaje, '', this.override2);
        setTimeout(()=>{
            this.redirigirSuccess();
        },1500);
        this.dialogRef.close();
      }else{
        this.toast.error(data.MENSAJE, '', this.override2);
      }
      this.spinner.hide('sp1');
          }, 
    (error) =>{

    }
  );

      }else{
        
      }
             
    }, 
  
  );


  
  
    
   }else{
     
    
      this.toast.error('Disculpe, debe llenar todos los campos obligatorios de cada sección', '' , this.override2);
   }
  
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
