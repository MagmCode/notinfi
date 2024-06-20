import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISelect } from 'app/models/login';
import { ProveeduriaService } from 'app/services/proveeduria.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit {

  tituloModal : string;
  formularioArticulo : FormGroup;

   //#region Declaracion de selects
   protected unidadVenta : ISelect[] = [];
   public unidadVentaCtrl : FormControl = new FormControl();
   public unidadVentaFiltrosCtrl : FormControl = new FormControl();
   public filtroUnidadVenta : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
   protected _onDestroy = new Subject<void>();  
   //#endregion

   //#region toast
  override2 = {
    positionClass: 'toast-bottom-full-width',
    closeButton: true,
    
  };
//#endregion
   
  constructor(private _proveeduriaService : ProveeduriaService,
             @Inject(MAT_DIALOG_DATA) public data: any,
             private formBuilder : FormBuilder,
              private toast: ToastrService,
              public dialogRef: MatDialogRef<CrearComponent>) 
              { 
              this.formularioArticulo = formBuilder.group({              
                idTipoArticuloFk : new FormControl(this.data.articulo.tipoArticulo , Validators.required),               
                codigoBdv : new FormControl('' , Validators.required),
                descripcion : new FormControl('' , Validators.required),
                idUnidadVenta : new FormControl('' , Validators.required),             
                estatus : new FormControl('' , Validators.required)
              });
             }

  ngOnInit(): void {
    this.tituloModal = this.data.articulo.desctipoArticulo;
    this.consultarUnidadVenta();

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

  guardar(){    
    if(this.formularioArticulo.valid){      
      this._proveeduriaService.crearArticulo(this.formularioArticulo.value).subscribe(
        (response)=>{
            if(response.estatus == "SUCCESS"){
              this.toast.success(response.mensaje, '' ,this.override2);             
              this.dialogRef.close(this.formularioArticulo.value);
            }else{
              this.toast.error(response.mensaje, '' ,this.override2);
            }
        });
    }else{
      this.toast.error("Disculpe todos los datos del formulario son obligatorios", '' ,this.override2);
    }
   
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
