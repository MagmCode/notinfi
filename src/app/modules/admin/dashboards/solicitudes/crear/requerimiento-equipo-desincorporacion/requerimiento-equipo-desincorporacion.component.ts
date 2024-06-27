import { SelectionModel } from '@angular/cdk/collections';
import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatRadioChange } from '@angular/material/radio';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ISelect } from 'app/models/login';
import { equipoDto, usuario } from 'app/models/usuario';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Overlay, ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatosDesincorporacionComponent } from '../datos-desincorporacion/datos-desincorporacion.component';

@Component({
  selector: 'app-requerimiento-equipo-desincorporacion',
  templateUrl: './requerimiento-equipo-desincorporacion.component.html',
  styleUrls: ['./requerimiento-equipo-desincorporacion.component.scss']
})
export class RequerimientoEquipoDesincorporacionComponent implements OnInit {

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
     
    displayedColumnsE: string[] = ['select','tipoEquipo','serial', 'marca', 'modelo',  'bienNacional'];
    positionOptionsE: TooltipPosition[] = ['below'];
    positionE = new FormControl(this.positionOptionsE[0]);
    dataSourceE: MatTableDataSource<equipoDto>;    
    selection = new SelectionModel<equipoDto>(true, []);

    ELEMENT_DATAE: equipoDto[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator | any;
    @ViewChild(MatSort) sort: MatSort = new MatSort; 
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
              private overlay: Overlay,) {

                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA); 
                this.dataSourceE = new MatTableDataSource(this.ELEMENT_DATAE); 
               
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
                  codusuarioGestion:  new FormControl('')
          
                })

               }

  ngOnInit(): void {
    
//#region select 

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
  this.dataSourceE.paginator = this.paginator;
  this.dataSourceE.sort = this.sort;
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

isShownP: boolean = true; 
isShown: boolean = false; 
isShownT: boolean = false;
isShownSU: boolean = false;
isShownPT: boolean = false;

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
  return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.relacion + 1}`;
}

handleRadioChange(event: MatRadioChange): void {
  this.selectedOption = event.value; // Actualiza la propiedad con el valor seleccionado
 

  if (this.selectedOption == 'Y') {
    
    this.isShown = true;
    this.isShownT = false;
    this.usuario = this._loginservices.obterTokenInfo();
    
    
    this._solicitudesService.consultarDetalleUsuario(this.usuario.codigo).subscribe(
      (data) =>{ 
      
        if(typeof data.data !=  'undefined'  ){
          this.usuFormulario.patchValue({
            codigoUsuario: data.data.codigo,
            cedula: data.data.cedula,
            nombres:   data.data.nombres + ' ' + data.data.apellidos,
            codUnidad: data.data.codUnidad,
            unidad: data.data.descUnidad
          }); 

       
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
      
          this.usuFormulario.patchValue({
            codusuarioGestion :  this.usuario.codigoSupervisor 
          })
          
        }
      );
    }
    

    
  

  } else {
    this.isShownT = true;
    this.isShown = false;
    this.obtenerPlantilla();
  }




}


mostrarInput(){
  
      
  this._solicitudesService.ubicacionFisicaDetalle(this.usuFormulario.value?.ubicacionFisica.id).subscribe(
     (response) => {
      
      this.detalleUbicacion.length = 0;
 
       this.detalleUbicacion.push({name: 'Selecciones', id:''});
       if(response.estatus == 'SUCCESS'){
 
         for(const iterator of response.data){
         
           if (this.usuFormulario.value?.ubicacionFisica.id == "OFICINA" || this.usuFormulario.value?.ubicacionFisica.id== "SUC") {
        
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
  
  
        if (this.piso.value.length > 0) {
         piso =  this.piso.value
        } else {
          piso =  this.piso.value.name
        }
  
  
  
  if (this.usuario.nivelCargo < 11) {
  
    if ( this.usuFormulario.value.codusuarioGestion == '') {
     
      this.usuFormulario = this.formBuilder.group({
  
        codusuarioGestion:  new FormControl('',  [Validators.required]),
  
      })
    
      return false;
    }
  }
  
  
  
  
  
        this.usuFormulario.value.ubicacionFisica = this.usuFormulario.value.ubicacionFisica.name + "-" + piso;
        this.usuFormulario.value.responsable = this.selectedOption;
        this.usuFormulario.value.idServicio = sessionStorage.getItem('idServicio');
        this.usuFormulario.value.codigoUsuarioResp = this.usuario.codigo;
        this.usuFormulario.value.cedulaResp =  this.usuario.cedula;
        this.usuFormulario.value.nombresResp = this.usuario.nombres + ' ' + this.usuario.apellidos;
        this.usuFormulario.value.codUnidadResp = this.usuario.codUnidad;
        this.usuFormulario.value.unidadResp =this.usuario.descUnidad;
        this.usuFormulario.value.codusuarioGestion =  this.usuFormulario.value.codusuarioGestion;
  
       var enviarData = {};
       enviarData= {
        "creacion":this.usuFormulario.value,
        "formulario":this.selection.selected
       }
      
          this._solicitudesService.crear(enviarData).subscribe(
          (data) =>{    
         
            if(data.estatus == "SUCCESS"){
              this.toast.success(data.mensaje , '', this.override2);            
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

openDialog(codUsuarioI : string) {
  const dialogRef = this.dialog.open(DatosDesincorporacionComponent,{
    data: { codUsuario :  codUsuarioI},
    disableClose: true,
  });
  
  dialogRef.afterClosed().subscribe(result => {
    
  });
}


redirigirSuccess(){
  
  this.router.navigate(['/solicitudes/gestionarSolicitudes']);
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
