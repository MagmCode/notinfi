import { Component, Inject, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISelect } from 'app/models/login';
import { articulo } from 'app/models/proveduria';
import { ProveeduriaService } from 'app/services/proveeduria.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {
  detalle !: articulo;
  tituloModal : string;

  //#region Declaracion de selects
  protected unidadVenta : ISelect[] = [];
  public unidadVentaCtrl : FormControl = new FormControl();
  public unidadVentaFiltrosCtrl : FormControl = new FormControl();
  public filtroUnidadVenta : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
  protected _onDestroy = new Subject<void>();  
  //#endregion

  formularioArticulo : FormGroup;

//#region toast
  override2 = {
    positionClass: 'toast-bottom-full-width',
    closeButton: true,
    
  };
//#endregion


  constructor(public dialogRef: MatDialogRef<EditarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _proveeduriaService : ProveeduriaService,
              private formBuilder : FormBuilder,
              private toast: ToastrService) { 

                this.formularioArticulo = formBuilder.group({
                  idArticuloPk : new FormControl('', Validators.required),
                  idTipoArticuloFk : new FormControl('', Validators.required),
                  acronimoTipoArticulo : new FormControl('', Validators.required),
                  codigoBdv : new FormControl('' , Validators.required),
                  descripcion : new FormControl('' , Validators.required),
                  idUnidadVenta : new FormControl('' , Validators.required),
                  unidadVenta : new FormControl('' , Validators.required),
                  estatus : new FormControl('' , Validators.required)
                });
              }
 

  ngOnInit(): void {
    this.llenarObjectoInicial();
    this.titulo();
    this.consultarUnidadVenta();

  }

  
  llenarObjectoInicial(){
    this.formularioArticulo.patchValue({
      idArticuloPk : this.data.articulo.idArticuloPk,
      idTipoArticuloFk : this.data.articulo.idTipoArticuloFk,
      acronimoTipoArticulo : this.data.articulo.acronimoTipoArticulo,
      codigoBdv : this.data.articulo.codigoBdv,
      descripcion : this.data.articulo.descripcion,
      idUnidadVenta : this.data.articulo.idUnidadVenta,
      unidadVenta : this.data.articulo.unidadVenta,
      estatus : this.data.articulo.estatus,
    })
  }

  titulo():void{
    switch (this.data.articulo.acronimoTipoArticulo) {
      case "A":   
        this.tituloModal = 'Artículo';     
        break;
      case "F":
        this.tituloModal = 'Formulario';     
        break;
      case "C":
        this.tituloModal = 'Consumible de Impresora';
        break;
    }
  }

  consultarUnidadVenta(){
    this._proveeduriaService.consultarUnidadVenta().subscribe(
      (response)=>{
          if(response.estatus == 'SUCCESS'){
            this.unidadVenta.push({name: 'Selecciones', id:''});
            for(const iterator of response.data){
              this.unidadVenta.push({name: iterator.descripcion, id: iterator.idUnidadVentaPk })             
          }
          this.unidadVentaCtrl.setValue(this.unidadVenta);
          this.filtroUnidadVenta.next(this.unidadVenta);
          this.unidadVentaFiltrosCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filtroUnidadVentaFuncion();
          });    

          }
      }
    )
  }


  guardarArticulo(){    
    if(this.formularioArticulo.valid){

      this._proveeduriaService.modificarArticulo(this.formularioArticulo.value).subscribe(
        (response)=>{
            if(response.estatus == "SUCCESS"){
              this.toast.success(response.mensaje, '' ,this.override2);
              this.formularioArticulo.patchValue({
                unidadVenta :  document.querySelector('#unidadVenta')?.textContent
              })
             
              this.dialogRef.close(this.formularioArticulo.value);
            }else{
              this.toast.error(response.mensaje, '' ,this.override2);
            }
        });
    }else{
      this.toast.error("Disculpe todos los datos del formulario son obligatorios", '' ,this.override2);
    }
   
  }

  cerrarModal(){
    this.dialogRef.close();
  }


  //#region funciones para filtro del select
  protected filtroUnidadVentaFuncion() {
    if (!this.unidadVenta) { 
      return;
    }
    // get the search keyword
    let search = this.unidadVentaFiltrosCtrl.value;
    if (!search) {
      this.filtroUnidadVenta.next(this.unidadVenta.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtroUnidadVenta.next(
      this.unidadVenta.filter(tipo => tipo.name.toLowerCase().indexOf(search) > -1)
    );
  }
  //#endregion

}
