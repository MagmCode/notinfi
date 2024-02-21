import { ChangeDetectorRef, Component, ComponentFactoryResolver, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'app/services/login.service';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { usuario } from 'app/models/usuario';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerComponent } from 'app/modules/admin/spinner/spinner.component';
import { ComponentPortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-datos-asignado',
  templateUrl: './datos-asignado.component.html',
  styleUrls: ['./datos-asignado.component.scss']
})



export class DatosAsignadoComponent implements OnInit {
  usuario = {} as any;
  datosFormulario: FormGroup;
  public codUsuario!: usuario;
  selectedOption: string;


  //#region toast
override2 = {
  positionClass: 'toast-bottom-full-width',
  closeButton: true,
  
};
//#endregion


  //#region  spinner
private overlayRef!: OverlayRef;
//#endregion

  constructor(public dialogRef: MatDialogRef<DatosAsignadoComponent>,
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
                  unidadResp: new FormControl('')
                })
          }

  ngOnInit(): void {
  this.obtenerDatos();
  }

  async obtenerDatos(){
    console.log("llego");
    console.log(this.codUsuario.codUsuario);
    this._solicitudesService.consultarDetalleUsuario(this.codUsuario.codUsuario).subscribe(
      (data) =>{ 
        console.log(data)    
        if(typeof data.data !=  'undefined'  ){
          this.datosFormulario.patchValue({
            codigoUsuario: data.data.codigo,
            cedula: data.data.cedula,
            nombres:   data.data.nombres + ' ' + data.data.apellidos,
            codUnidad: data.data.codUnidad,
            unidad: data.data.descUnidad
          }); 

          console.log(this.datosFormulario)
        }else{
          
        }
               
      }, 

    );
  } 
  
  

  async submit(){
    if(this.datosFormulario.valid){
  /*    this.spinner.show('sp1'); */
  
  this.usuario = this._loginservices.obterTokenInfo();
  console.log(this.usuario);
  console.log(this.datosFormulario.value.codigoUsuario)

  this._solicitudesService.consultarDetalleUsuario(this.datosFormulario.value.codigoUsuario).subscribe(
    (data) =>{ 
      console.log(data.data)    
      if(typeof data.data !=  'undefined'  ){
        this.datosFormulario.patchValue({
          
          codUnidadOrg: data.data.codUnidadOrg,
          unidadOrg: data.data.unidadOrg,
          codUnidadJrq: data.data.codUnidadJrq,
          unidadJrq: data.data.unidadJrq
          
  
        }); 
      
  
        this.datosFormulario.value.responsable = 'N';
        this.datosFormulario.value.idServicio = '1';
        this.datosFormulario.value.codigoUsuarioResp = this.usuario.codigo;
        this.datosFormulario.value.cedulaResp =  this.usuario.cedula;
        this.datosFormulario.value.nombresResp = this.usuario.nombres + ' ' + this.usuario.apellidos;
        this.datosFormulario.value.codUnidadResp = this.usuario.codUnidad;
        this.datosFormulario.value.unidadResp =this.usuario.descUnidad;
  
  
        console.log( this.datosFormulario.value)
        
        
    this._solicitudesService.crear(this.datosFormulario.value).subscribe(
    (data) =>{    
     console.log(data);
      if(data.estatus == "SUCCESS"){
        this.toast.success(data.mensaje+ " Número de solicitud " + data.data, '', this.override2);
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

}
