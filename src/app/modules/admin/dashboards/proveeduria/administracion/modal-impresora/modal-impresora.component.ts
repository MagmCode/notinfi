import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProveeduriaService } from 'app/services/proveeduria.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-impresora',
  templateUrl: './modal-impresora.component.html',
  styleUrls: ['./modal-impresora.component.scss']
})
export class ModalImpresoraComponent implements OnInit {
 
  tituloModal : string;
  formularioImpresora : FormGroup;
  buttonModificar : boolean = false;
  buttonCrear : boolean = false;

     //#region toast
     override2 = {
      positionClass: 'toast-bottom-full-width',
      closeButton: true,      
    };
  //#endregion
  
  constructor(public dialogRef: MatDialogRef<ModalImpresoraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _proveeduriaService : ProveeduriaService,
    private formBuilder : FormBuilder,
    private toast: ToastrService) {
      
    this.formularioImpresora = formBuilder.group({
      idTipoImpresoraPk : new FormControl('', Validators.required),
      descripcion : new FormControl('', Validators.required),
      estatus: new FormControl('', Validators.required)
    });
   }

  ngOnInit(): void {    
    if(this.data != undefined ){
      this.tituloModal = this.formularioImpresora.value?.descripcion;
      this.buttonModificar = true;
      this.buttonCrear = false;
    }else{
      this.tituloModal = 'Creación de impresora';
      this.buttonModificar = false;
      this.buttonCrear = true;
    }
    this.llenarObjectoInicial();

   
   
  }

  llenarObjectoInicial(){
    if(this.data != undefined ){
      this.formularioImpresora.patchValue({
        idTipoImpresoraPk : this.data.articulo.idTipoImpresoraPk,
        descripcion : this.data.articulo.descripcion,
        estatus : this.data.articulo.estatus
      })
    }else{
      this.formularioImpresora = this.formBuilder.group({
        idTipoImpresoraPk : new FormControl(''),
        descripcion : new FormControl('', Validators.required),
        estatus: new FormControl('', Validators.required)
      });
    }
    
  }


  cerrarModal(){
    this.dialogRef.close();
  }

  gestionImpresora(accion: any){
    if(accion == 'M'){
        this.modificarImpresora();
    }else if(accion == 'C'){
      this.guardarImpresora();
    }
  }


  guardarImpresora(){
    if(this.formularioImpresora.valid){
      this._proveeduriaService.creacionImpresora(this.formularioImpresora.value).subscribe(
        (response)=>{
            if(response.estatus == "SUCCESS"){
              this.toast.success(response.mensaje, '' ,this.override2);
             
              this.dialogRef.close(this.formularioImpresora.value);
            }else{
              this.toast.error(response.mensaje, '' ,this.override2);
            }
        });
    }else{
      this.toast.error("Disculpe todos los datos del formulario son obligatorios", '' ,this.override2);
    }
  }

  
  modificarImpresora(){    
    if(this.formularioImpresora.valid){

      this._proveeduriaService.modificarImpresora(this.formularioImpresora.value).subscribe(
        (response)=>{
            if(response.estatus == "SUCCESS"){
              this.toast.success(response.mensaje, '' ,this.override2);
             
              this.dialogRef.close(this.formularioImpresora.value);
            }else{
              this.toast.error(response.mensaje, '' ,this.override2);
            }
        });
    }else{
      this.toast.error("Disculpe todos los datos del formulario son obligatorios", '' ,this.override2);
    }
   
  }

}
