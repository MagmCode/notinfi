import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { solicitudesDto } from 'app/models/usuario';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Overlay, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-reasignar',
  templateUrl: './modal-reasignar.component.html',
  styleUrls: ['./modal-reasignar.component.scss']
})
export class ModalReasignarComponent implements OnInit {
  solicitudesDto = {} as any;
  usuario = {} as any;
  datosFormulario: FormGroup;
  mensaje : any;
  public solicitud!: solicitudesDto;
      //#region toast
override2 = {
  positionClass: 'toast-bottom-full-width',
  closeButton: true,
  
};
//#endregion
  constructor(public dialogRef: MatDialogRef<ModalReasignarComponent>,
             @Inject(MAT_DIALOG_DATA) public data: solicitudesDto,
             private _loginservices: LoginService,
             private _solicitudesService : SolicitudesService,
              private overlay: Overlay,              
             private router: Router,
             private toast: ToastrService,
             private spinner: NgxSpinnerService,) { 

              this.solicitud = data;


             }

  ngOnInit(): void {
    this.obtenerDatos();
  }

  async obtenerDatos(){

this.mensaje = "¿Esta seguro de desasignar la solicitud " + this.solicitud.idSolicitud+ " a " +  this.solicitud.nombreUsuarioGestion+" ?"
  }

  Reasignar(){


    this.usuario = this._loginservices.obterTokenInfo();
    this._solicitudesService.reasignarSolicitud(this.solicitud.idSolicitud ,this.usuario.codigo).subscribe(
      (data) =>{    
       
      if(data.estatus == "SUCCESS"){
      this.toast.success(data.mensaje + " Número de solicitud " + this.solicitud.idSolicitud, '', this.override2);            
      setTimeout(()=>{
      this.refrescarPagina();
      },1500);  
      this.dialogRef.close();
      }else{
      this.toast.error(data.mensaje, '', this.override2);
      }
      this.spinner.hide();
      /*     this.spinner.hide('sp1'); */
      }
      ); 


      }

      refrescarPagina() {
        /* this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([], { relativeTo: this.route });
        }); */
        window.location.reload();
      }

}
