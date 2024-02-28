import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, NgModule, OnInit, ViewChild, ViewContainerRef,  } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import {FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ComponentPortal } from '@angular/cdk/portal';
import {TooltipPosition} from '@angular/material/tooltip';

import {MatTableDataSource} from '@angular/material/table';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { usuario } from 'app/models/usuario';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { forEach } from 'lodash';
import { DatosAsignadoComponent } from '../datos-asignado/datos-asignado.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerComponent } from 'app/modules/admin/spinner/spinner.component';
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
   //#region  tablas
   displayedColumns: string[] = ['codUsuario', 'cedula', 'nombres', 'codUnidad', 'unidad', 'codCargo', 'cargo', 'acciones'];
   positionOptions: TooltipPosition[] = ['below'];
   position = new FormControl(this.positionOptions[0]);
   dataSource: MatTableDataSource<usuario>;
   ELEMENT_DATA: usuario[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort;  
   //#endregion

  //#region usuarios Interfaz

  public usuarioTable : any = {
    codUsuario: '',
    cedula : '',
    nombres : '',
    codUnidad : '',
    unidad : '',
    codCargo : '',
    cargo : ''
  }; 
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
        unidadResp: new FormControl('')

      })
    }

  ngOnInit(): void {
    console.log("iniciado")
    this.spinner.show('sp1');
    console.log(this.spinner.show())
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

isShown: boolean = false; // Inicialmente oculto
isShownT : boolean = false;
handleRadioChange(event: MatRadioChange): void {
  this.selectedOption = event.value; // Actualiza la propiedad con el valor seleccionado
  console.log( this.selectedOption);

  if (this.selectedOption == 'Y') {
    
    this.isShown = true;
    this.isShownT = false;
    this.usuario = this._loginservices.obterTokenInfo();
    console.log(this.usuario.codigo);
    
    this._solicitudesService.consultarDetalleUsuario(this.usuario.codigo).subscribe(
      (data) =>{ 
        console.log(data.data)    
        if(typeof data.data !=  'undefined'  ){
          this.usuFormulario.patchValue({
            codigoUsuario: data.data.codigo,
            cedula: data.data.cedula,
            nombres:   data.data.nombres + ' ' + data.data.apellidos,
            codUnidad: data.data.codUnidad,
            unidad: data.data.descUnidad
          }); 

          console.log(this.usuFormulario)
        }else{
          
        }
               
      }, 

    );

  } else {
    this.isShownT = true;
    this.isShown = false;
    this.obtenerPlantilla();
  }




}

async submit(){
  if(this.usuFormulario.valid){
/*    this.spinner.show('sp1'); */
this.spinner.show();
this.usuario = this._loginservices.obterTokenInfo();
console.log(this.usuario);
console.log(this.usuFormulario.value.codigoUsuario)
this._solicitudesService.consultarDetalleUsuario(this.usuFormulario.value.codigoUsuario).subscribe(
  (data) =>{ 
    console.log(data.data)    
    if(typeof data.data !=  'undefined'  ){
      this.usuFormulario.patchValue({
        
        codUnidadOrg: data.data.codUnidadOrg,
        unidadOrg: data.data.unidadOrg,
        codUnidadJrq: data.data.codUnidadJrq,
        unidadJrq: data.data.unidadJrq
        

      }); 
      console.log( this.selectedOption);

      this.usuFormulario.value.responsable = this.selectedOption;
      this.usuFormulario.value.idServicio = '1';
      this.usuFormulario.value.codigoUsuarioResp = this.usuario.codigo;
      this.usuFormulario.value.cedulaResp =  this.usuario.cedula;
      this.usuFormulario.value.nombresResp = this.usuario.nombres + ' ' + this.usuario.apellidos;
      this.usuFormulario.value.codUnidadResp = this.usuario.codUnidad;
      this.usuFormulario.value.unidadResp =this.usuario.descUnidad;


      console.log( this.usuFormulario.value)
      

      this._solicitudesService.crear(this.usuFormulario.value).subscribe(
        (data) =>{    
         console.log(data);
          if(data.estatus == "SUCCESS"){
            this.toast.success(data.mensaje + " Número de solicitud " + data.data, '', this.override2);            
            setTimeout(()=>{
              this.redirigirSuccess();
          },1500);  
          }else{
            this.toast.error(data.mensaje, '', this.override2);
          }
          this.spinner.hide();
      /*     this.spinner.hide('sp1'); */
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
      console.log(response)
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
  const dialogRef = this.dialog.open(DatosAsignadoComponent,{
    data: { codUsuario :  codUsuarioI},
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

}
