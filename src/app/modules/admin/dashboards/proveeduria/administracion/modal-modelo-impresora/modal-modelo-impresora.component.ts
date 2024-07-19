import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ISelect } from 'app/models/login';
import { ProveeduriaService } from 'app/services/proveeduria.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { values } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-modal-modelo-impresora',
  templateUrl: './modal-modelo-impresora.component.html',
  styleUrls: ['./modal-modelo-impresora.component.scss']
})
export class ModalModeloImpresoraComponent implements OnInit, AfterViewInit {

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

  protected tipoImpresora : ISelect[] = [];
  public tipoImpresoraCtrl : FormControl = new FormControl();
  public tipoImpresoraFiltrosCtrl : FormControl = new FormControl();
  public filtrotipoImpresora : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
  protected _onDestroy = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<ModalModeloImpresoraComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private _proveeduriaService : ProveeduriaService,
              private formBuilder : FormBuilder,
              private toast: ToastrService,
              private _solicitudesService : SolicitudesService,) { 

      this.formularioImpresora = formBuilder.group({
        idModeloBnPk : new FormControl('', Validators.required),
        idTipoImpresoraFk : new FormControl('', Validators.required),
        descripcion : new FormControl('', Validators.required),
        estatus: new FormControl('', Validators.required)
      });
    }

  ngAfterViewInit(): void {
    this.tipoImpresoraCtrl.setValue(this.tipoImpresora);
    this.filtrotipoImpresora.next(this.tipoImpresora);
    this.tipoImpresoraFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtrotipoImpresoraT();
      
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
    this.obternerTipoImpresora();

  }

  gestionImpresora(accion: any){
    if(accion == 'M'){
        this.modificarModeloImpresora();
    }else if(accion == 'C'){
      this.guardarImpresora();
    }
  }

  llenarObjectoInicial(){
    if(this.data != undefined ){
    
      this.formularioImpresora = this.formBuilder.group({
        idModeloBnPk : new FormControl(this.data.articulo.idModeloBnPk),
        idTipoImpresoraFk : new FormControl({value:this.data.articulo.idTipoImpresoraFk,   disabled: true}),
        descripcion : new FormControl(this.data.articulo.descripcion),
        estatus : new FormControl(this.data.articulo.estatus)

        
      });
      
    }else{
      this.formularioImpresora = this.formBuilder.group({
        idTipoImpresoraFk : new FormControl(''),
        descripcion : new FormControl('', Validators.required),
        estatus: new FormControl('', Validators.required)
      });
    }
    
  }

  
  cerrarModal(){
    this.dialogRef.close();
  }

  guardarImpresora(){
    if(this.formularioImpresora.valid){
      this._proveeduriaService.creacionImpresoraModelo(this.formularioImpresora.value).subscribe(
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

  
  modificarModeloImpresora(){      
   if(this.formularioImpresora.valid){
      this._proveeduriaService.modificarImpresoraModelo(this.formularioImpresora.getRawValue()).subscribe(
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


  protected filtrotipoImpresoraT() {
    if (!this.tipoImpresora) {
      return;
    }
    // get the search keyword
    let search = this.tipoImpresoraFiltrosCtrl.value;
    if (!search) {
      this.filtrotipoImpresora.next(this.tipoImpresora.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtrotipoImpresora.next(
      this.tipoImpresora.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
    );
  }

  obternerTipoImpresora(){
    this._solicitudesService.tipoImpresora().subscribe(
      (response) => {
        this.tipoImpresora.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){  
          for(const iterator of response.data){
              this.tipoImpresora.push({name:iterator.descripcion, id:iterator.idTipoImpresoraPk})             
          }
  
        }
        
      }
    );
  }


}
