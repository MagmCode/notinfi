import {  Component,  Inject, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'app/services/login.service';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { solicitudesDto, usuario } from 'app/models/usuario';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerComponent } from 'app/modules/admin/spinner/spinner.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { ISelect } from 'app/models/login';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { forEach } from 'lodash';

@Component({
  selector: 'app-modaldecisiones',
  templateUrl: './modaldecisiones.component.html',
  styleUrls: ['./modaldecisiones.component.scss']
})
export class ModaldecisionesComponent implements OnInit {
  solicitudesDto = {} as any;
  usuario = {} as any;
  datosFormulario: FormGroup;
  public solicitud!: solicitudesDto;
  selectedOption: string;
  motivos: any;
  codigo: any;
  isShownA: boolean = false; // Inicialmente oculto
  isShownR: boolean = false;
  isShownD: boolean = false;
  isShownM: boolean = false;
  mensaje : any;
  mensaje2 : any;
  idSolicitud : any;
  nombres : any;
  tipoServicio: any;
  observacion : any;
  isShownSU : boolean = false;
  esValido:  boolean = false;
  hasError :boolean = false;
  isShownCO :boolean = true;
  hasErrorOb :boolean = false;
  codusuarioAprobador: any = null;

    //#region toast
override2 = {
  positionClass: 'toast-bottom-full-width',
  closeButton: true,
  
};
//#endregion
  //#region Select de MOTIVP
  protected motivo : ISelect[] = [];
  public motivoCtrl : FormControl = new FormControl();
  public motivoFiltrosCtrl : FormControl = new FormControl();
  public filtromotivo : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
  //#endregion
   //#region Select de tipo supervisor
   protected supervisor : ISelect[] = [];
   public supervisorCtrl : FormControl = new FormControl();
   public supervisorFiltrosCtrl : FormControl = new FormControl();
   public filtrosupervisor : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
   //#endregion

  protected _onDestroy = new Subject<void>();

  //#region  spinner
private overlayRef!: OverlayRef;
//#endregion
  constructor(public dialogRef: MatDialogRef<ModaldecisionesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: solicitudesDto,
              private _loginservices: LoginService,
              private _solicitudesService : SolicitudesService,
              private overlay: Overlay,              
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService,
              private formBuilder : FormBuilder,
              private route: ActivatedRoute) { 
                
                this.solicitud = data;

                this.datosFormulario = formBuilder.group({
                  
                  idSolicitud:  new FormControl({value: null, readonly: true}),
                  codigoUsuario: new FormControl({value: null, readonly: true}),
                  cedula: new FormControl({value: null, readonly: true}),
                  nombres: new FormControl({value: null, readonly: true}),
                  codUnidad: new FormControl({value: null, readonly: true}),
                  unidad: new FormControl({value: null, readonly: true}),
                  codUnidadOrg: new FormControl({value: null, readonly: true}),
                  unidadOrg: new FormControl({value: null, readonly: true}),
                  codUnidadJrq: new FormControl({value: null, readonly: true}),
                  unidadJrq: new FormControl({value: null, readonly: true}),
                  decision: new FormControl({value: null, readonly: true}),
                  motivo:  new FormControl(''),
                  observacion : new FormControl(''),
                  codusuarioGestion:  new FormControl(''),
                })




              }

  ngOnInit(): void {
    this.obtenerDatos();
    //#region select 
    this.motivoCtrl.setValue(this.motivo);
    this.filtromotivo.next(this.motivo);
    this.motivoFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtroMotivoT();
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



  
  async obtenerDatos(){
    
    this.idSolicitud = this.solicitud.idSolicitud,
    this.nombres =   this.solicitud.nombres,
    this.tipoServicio= this.solicitud.categoria + '-'+ this.solicitud.tipoServicio  + '-'+  this.solicitud.servicio  


if (this.solicitud.metodo == 'buzon') {
  this.isShownCO = false;
}


if (this.solicitud.decision  == 'A') {
this.isShownA = true;
this.isShownR = false;
this.isShownD = false;
if (this.solicitud.metodo == 'buzon') {

  if (this.solicitud.idTipoServicio == 1 ) {
    this.mensaje = "¿Está seguro de asignar los siguiente equipos?";
  } else if (this.solicitud.idTipoServicio == 2) {
    this.mensaje = "¿Esta seguro de asignar los artículos?";
  } else if (this.solicitud.idTipoServicio == 3) {
    if (this.solicitud.idTarea == 39) {
      
    this.mensaje = "La solicitud sera enviada a su supervisor para la aprobación";
    }else if (this.solicitud.idTarea == 40){

      this.mensaje = "¿Está seguro de aprobar la siguiente solicitud?";
    } else {
      
    this.mensaje = "¿Está seguro de asignar el siguiente personal a la solicitud?";
    }
  }



}else{
  if (this.solicitud.idTarea == 6 ) {
    this.mensaje = "Conforme con la Solicitud";
  } else {
    this.mensaje = "Aprobar Solicitud";
  }

}

if (this.solicitud.idTarea == 2 ) {

  this.usuario = this._loginservices.obterTokenInfo();
  this.isShownSU = true;

  this._solicitudesService.obtenerSupervisoresJRQ(this.usuario.codUnidadJrq ,this.usuario.nivelCargo,this.usuario.codigo ).subscribe(
    (response) => {
  
   //   this.supervisor.push({name: 'Selecciones', id:''});
      if(response.estatus == 'SUCCESS'){
        for(const iterator of response.data){
          this.supervisor.push({name: iterator.nombres + ' ' +iterator.apellidos , id:iterator.codUsuario})
        }
      }
      
    }
  );


}

}else if (this.solicitud.decision  == 'D') {
this._solicitudesService.consultarMotivo().subscribe(
  (response) => {
 
    this.motivo.push({name: 'Selecciones', id:''});
    this.motivo.push({name: 'Datos no Corresponde', id:'3'})
    if(response.estatus == 'SUCCESS'){
      for(const iterator of response.data){
        
      }
    }
    
  }
);

this.isShownR = false,
this.isShownM = true,
this.isShownA = false,
this.isShownD = true,
this.mensaje = "Devolver Solicitud";

} else {

this._solicitudesService.consultarMotivo().subscribe(
  (response) => {
 
    this.motivo.push({name: 'Selecciones', id:''});
    if(response.estatus == 'SUCCESS'){
      for(const iterator of response.data){
        this.motivo.push({name: iterator.nombre, id:iterator.id})
      }
    }
    
  }
);

this.isShownR = true,
this.isShownM = true,
this.isShownA = false,
this.isShownD = false,
this.mensaje = "Rechazar Solicitud";
}



} 

Aprobar(){

this.spinner.show();
this.usuario = this._loginservices.obterTokenInfo();

this._solicitudesService.consultarDetalleUsuario(this.usuario.codigo).subscribe(
(data) =>{ 

if(typeof data.data !=  'undefined'  ){
  this.datosFormulario.patchValue({
 
    codigoUsuario:data.data.codigo,
    cedula:data.data.cedula,
    nombres:data.data.nombres + ' ' + data.data.apellidos,
    codUnidad:data.data.codUnidad,
    unidad:data.data.descUnidad,
    codUnidadOrg: data.data.codUnidadOrg,
    unidadOrg: data.data.unidadOrg,
    codUnidadJrq: data.data.codUnidadJrq,
    unidadJrq: data.data.unidadJrq
    

  }); 
  
  if (this.solicitud.idTarea == 2) {
    if(!this.codusuarioAprobador) {
      this.hasError = true;
      return;
    }else{

      this.datosFormulario.value.codusuarioGestion =this.codusuarioAprobador?.id;
    }

 
 }


if (this.isShownCO != false) {
if(!this.codigo) {
this.esValido = true;
return;
}
}

  this.datosFormulario.value.decision = 'A';
  this.datosFormulario.value.idSolicitud =  this.idSolicitud;
  this.datosFormulario.value.motivo = 0;
  this.datosFormulario.value.observacion = this.solicitud.detalle


var formulario = [];        
if (this.solicitud.metodo == 'buzon') {

this.solicitud.formulario.forEach(elemt => {
formulario.push(elemt)

});


} 

var enviarData = {};
enviarData= {
"solicitud":this.datosFormulario.value,
"formulario":formulario
}


if (this.solicitud.metodo == 'buzon') {
  this._solicitudesService.gestionFlujoTarea(enviarData).subscribe(
    (data) =>{    
    
    if(data.estatus == "SUCCESS"){
    this.toast.success(data.mensaje, '', this.override2);            
    setTimeout(()=>{
    this.redirigirSuccess();
    },1500);  
    this.dialogRef.close();
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
} else {
/*   this._solicitudesService.certificarToken(this.usuario.codigo, this.codigo).subscribe(
    (response) => { 
     
      if(response.estatus == 'SUCCESS'){ 
        */
      
          this._solicitudesService.gestionFlujoTarea(enviarData).subscribe(
            (data) =>{    
              
            if(data.estatus == "SUCCESS"){
            this.toast.success(data.mensaje, '', this.override2);            
            setTimeout(()=>{
            this.redirigirSuccess();
            },1500);  
            this.dialogRef.close();
            }else{
            this.toast.error(data.mensaje, '', this.override2);
            }
            this.spinner.hide();
         
            }, 
            (error) =>{
            this.toast.error(data.mensaje, '', this.override2);
            }
            ); 
  
    /*  }else{
  
        this.toast.error(response.mensaje, '', this.override2);
      }
    
    }
  );   */
}






}else{
  this.toast.error(data.mensaje, '', this.override2);
}
       
}, 

);


}


Devolver(){
this.spinner.show();
this.usuario = this._loginservices.obterTokenInfo();


this._solicitudesService.consultarDetalleUsuario(this.usuario.codigo).subscribe(
(data) =>{ 

if(typeof data.data !=  'undefined'  ){
  this.datosFormulario.patchValue({
    codigoUsuario:data.data.codigo,
    cedula:data.data.cedula,
    nombres:data.data.nombres + ' ' + data.data.apellidos,
    codUnidad:data.data.codUnidad,
    unidad:data.data.descUnidad,
    codUnidadOrg: data.data.codUnidadOrg,
    unidadOrg: data.data.unidadOrg,
    codUnidadJrq: data.data.codUnidadJrq,
    unidadJrq: data.data.unidadJrq
    

  }); 

  if(!this.motivos) {
    this.hasError = true;
    return;
  }
  if (this.isShownCO != false) {
    if(!this.codigo) {
      this.esValido = true;
      return;
    }
  }
  
  this.datosFormulario.value.decision = 'D';
  this.datosFormulario.value.idSolicitud = this.idSolicitud;
  this.datosFormulario.value.motivo =  3;
  this.datosFormulario.value.observacion = this.observacion;

  
  var enviarData = {};
  enviarData= {
   "solicitud":this.datosFormulario.value,
   "formulario":[]
  }

  if (this.solicitud.metodo == 'buzon') {
/*  */
    this._solicitudesService.gestionFlujoTarea(enviarData).subscribe(
      (data) =>{    
     
        if(data.estatus == "SUCCESS"){
          this.toast.success(data.mensaje, '', this.override2);            
          setTimeout(()=>{
            this.redirigirSuccess();
        },1500);  
        this.dialogRef.close();
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

     this._solicitudesService.certificarToken(this.usuario.codigo, this.codigo).subscribe(
      (response) => {
       
        if(response.estatus == 'SUCCESS'){
          
          this._solicitudesService.gestionFlujoTarea(enviarData).subscribe(
            (data) =>{    
           
              if(data.estatus == "SUCCESS"){
                this.toast.success(data.mensaje, '', this.override2);            
                setTimeout(()=>{
                  this.redirigirSuccess();
              },1500);  
              this.dialogRef.close();
              }else{
                this.toast.error(data.mensaje, '', this.override2);
              }
              this.spinner.hide();
    
                  }, 
            (error) =>{
              this.toast.error(data.mensaje, '', this.override2);
            }
          ); 
    
        }else{
    
          this.toast.error(response.mensaje, '', this.override2);
        }
      
      }
    );
 

  } 



}else{
  this.toast.error(data.mensaje, '', this.override2);
}
       
}, 

);
}

  Rechazar(){
    this.spinner.show();
    this.usuario = this._loginservices.obterTokenInfo();


    this._solicitudesService.consultarDetalleUsuario(this.usuario.codigo).subscribe(
      (data) =>{ 
    
        if(typeof data.data !=  'undefined'  ){
          this.datosFormulario.patchValue({
            codigoUsuario:data.data.codigo,
            cedula:data.data.cedula,
            nombres:data.data.nombres + ' ' + data.data.apellidos,
            codUnidad:data.data.codUnidad,
            unidad:data.data.descUnidad,
            codUnidadOrg: data.data.codUnidadOrg,
            unidadOrg: data.data.unidadOrg,
            codUnidadJrq: data.data.codUnidadJrq,
            unidadJrq: data.data.unidadJrq
            
    
          }); 
    
          if(!this.motivos) {
            this.hasError = true;
            return;
          }
          if (this.isShownCO != false) {
            if(!this.codigo) {
              this.esValido = true;
              return;
            }
          }
          debugger
if (this.solicitud.idTipoServicio == 3) {
  if(!this.observacion) {
    this.hasErrorOb = true;
    return;
  }
} 
        
          
          this.datosFormulario.value.decision = 'R';
          this.datosFormulario.value.idSolicitud = this.idSolicitud;
          this.datosFormulario.value.motivo =  this.motivos?.id;
          this.datosFormulario.value.observacion = this.observacion;

          var formulario = [];        
if (this.solicitud.metodo == 'buzon') {

this.solicitud.formulario.forEach(elemt => {
formulario.push(elemt)

});


} 
          var enviarData = {};
          enviarData= {
           "solicitud":this.datosFormulario.value,
           "formulario":formulario
          }
console.log(enviarData)

          return
          
          if (this.solicitud.metodo == 'buzon') {      

    this._solicitudesService.gestionFlujoTarea(enviarData).subscribe(
      (data) =>{    
     
        if(data.estatus == "SUCCESS"){
          this.toast.success(data.mensaje, '', this.override2);            
          setTimeout(()=>{
            this.redirigirSuccess();
        },1500);  
        this.dialogRef.close();
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

    this._solicitudesService.certificarToken(this.usuario.codigo, this.codigo).subscribe(
      (response) => {
       
        if(response.estatus == 'SUCCESS'){
         
          this._solicitudesService.gestionFlujoTarea(enviarData).subscribe(
            (data) =>{    
           
              if(data.estatus == "SUCCESS"){
                this.toast.success(data.mensaje, '', this.override2);            
                setTimeout(()=>{
                  this.redirigirSuccess();
              },1500);  
              this.dialogRef.close();
              }else{
                this.toast.error(data.mensaje, '', this.override2);
              }
              this.spinner.hide();
        
                  }, 
            (error) =>{
              this.toast.error(data.mensaje, '', this.override2);
            }
          ); 
    
        }else{
    
          this.toast.error(response.mensaje, '', this.override2);
        }
      
      }
    );

  } 
     
    
        }else{
          this.toast.error(data.mensaje, '', this.override2);
        }
               
      }, 
    
    );
  }

  refrescarPagina() {
    /* this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([], { relativeTo: this.route });
    }); */
    window.location.reload();
  }

  redirigirSuccess(){
    if (this.solicitud.metodo == 'buzon') {
 
  
      this.router.navigate(['/buzon/buzonAsignadas']);

        }else{
          this.router.navigate(['/solicitudes/gestionarSolicitudes']);

        }
 
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


  protected filtroMotivoT() {
    if (!this.motivo) {
      return;
    }
    // get the search keyword
    let search = this.motivoFiltrosCtrl.value;
    if (!search) {
      this.filtromotivo.next(this.motivo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtromotivo.next(
      this.motivo.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
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
