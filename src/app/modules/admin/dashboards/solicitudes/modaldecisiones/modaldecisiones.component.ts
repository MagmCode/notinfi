import {  Component,  Inject, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'app/services/login.service';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { solicitudesDto, usuario } from 'app/models/usuario';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerComponent } from 'app/modules/admin/spinner/spinner.component';
import { ComponentPortal } from '@angular/cdk/portal';

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
  isShownA: boolean = false; // Inicialmente oculto
  isShownR: boolean = false;
  mensaje : any;
    //#region toast
override2 = {
  positionClass: 'toast-bottom-full-width',
  closeButton: true,
  
};
//#endregion


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
              private formBuilder : FormBuilder,) { 
                
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
                  ubicacionFisica: new FormControl({value: null, readonly: true}),
                  fechaCreacion: new FormControl({value: null, readonly: true}),
                  fechaModificacion: new FormControl({value: null, readonly: true}),
                  estatus: new FormControl({value: null, readonly: true}),
                  idServicio: new FormControl({value: null, readonly: true}),
                  responsable: new FormControl({value: null, readonly: true}),
                  codigoUsuarioResp: new FormControl({value: null, readonly: true}),
                  cedulaResp: new FormControl({value: null, readonly: true}),
                  nombresResp: new FormControl({value: null, readonly: true}),
                  codUnidadResp: new FormControl({value: null, readonly: true}),
                  unidadResp: new FormControl({value: null, readonly: true}),
                  idTarea: new FormControl({value: null, readonly: true}),
                  tarea: new FormControl({value: null, readonly: true}),
                  codusuarioGestion: new FormControl({value: null, readonly: true}),
                  decision: new FormControl({value: null, readonly: true})
                 
                })




              }

  ngOnInit(): void {
    this.obtenerDatos();
  }




  
  async obtenerDatos(){
    console.log(this.solicitud.idSolicitud 
      + ' ' + this.solicitud.codigoUsuario 
      + ' ' + this.solicitud.nombres + ' ' + this.solicitud.tarea  
      + ' ' + this.solicitud.decision  );
     
          this.datosFormulario.patchValue({
            idSolicitud: this.solicitud.idSolicitud,
            nombres:   this.solicitud.nombres,
            tarea: this.solicitud.tarea ,
          }); 
      if (this.solicitud.decision  == 'A') {
        this.isShownA = true,
        this.isShownR = false,
        this.mensaje = "¿Usted esta seguro de aprobar la siguiente solicitud?";
      } else {
        this.isShownR = true,
        this.isShownA = false,
        this.mensaje = "¿Usted esta seguro de rechazar la siguiente solicitud?";
      }


   
  } 

  Aprobar(){
    console.log(this.datosFormulario.value.idSolicitud)


  }

  Rechazar(){
    console.log(this.datosFormulario.value.idSolicitud)

  }

  async submit(){
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
