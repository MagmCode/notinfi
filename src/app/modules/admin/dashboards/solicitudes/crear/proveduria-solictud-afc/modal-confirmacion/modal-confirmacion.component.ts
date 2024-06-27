import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { groupBy } from 'lodash';
import { NgxSpinnerService } from 'ngx-spinner';
import { OverlayRef, ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-confirmacion',
  templateUrl: './modal-confirmacion.component.html',
  styleUrls: ['./modal-confirmacion.component.scss']
})
export class ModalConfirmacionComponent implements OnInit {
  mensaje: any;
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

  constructor(public dialogRef: MatDialogRef<ModalConfirmacionComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _loginService : LoginService, 
              private _solicitudesService : SolicitudesService,
              public dialog: MatDialog,          
              private formBuilder : FormBuilder,              
              private toast: ToastrService,
              private router: Router,
              private spinner: NgxSpinnerService,) { }

  ngOnInit(): void {

this.mensaje ="Recuerde tener el método de autenticación AMI Ven, al momento de dar conformidad a la solicitud";
  }

 async submit(){
  this.dialogRef.close();


  if (this.data.enviarData.creacion.idServicio == '6') {


     const resul2= groupBy(this.data.enviarData.formulario, (a) => a.requiereAprobacion);

    
let mensaje ;
for (const key in resul2) {
  if (Object.prototype.hasOwnProperty.call(resul2, key)) {
    const element = resul2[key];

    this.data.enviarData.formulario = element


     

     this._solicitudesService.crear(this.data.enviarData).subscribe(
      (data) =>{    
       if(data.estatus == "SUCCESS"){
       
        this.toast.success(data.mensaje, '', this.override2);  

        }else{


          this.toast.error(data.mensaje, '', this.override2);
        }
        this.spinner.hide();
     this.spinner.hide('sp1'); 
            }, 
      (error) =>{
        this.toast.error('', '', this.override2);
      }
    );  


  }
}
 
          
setTimeout(()=>{
  
  this.redirigirSuccess();
},1500); 
    
  } else {
    this._solicitudesService.crear(this.data.enviarData).subscribe(
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
        this.toast.error('', '', this.override2);
      }
    ); 
  }

  
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  } 
  
  redirigirSuccess(){
  
    this.router.navigate(['/solicitudes/gestionarSolicitudes']);
  }


}
