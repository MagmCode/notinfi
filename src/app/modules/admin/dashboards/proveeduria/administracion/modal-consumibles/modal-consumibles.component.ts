import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ISelect } from 'app/models/login';
import { ProveeduriaService } from 'app/services/proveeduria.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-modal-consumibles',
  templateUrl: './modal-consumibles.component.html',
  styleUrls: ['./modal-consumibles.component.scss']
})
export class ModalConsumiblesComponent implements OnInit, AfterViewInit {

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

protected tipoModelo : ISelect[] = [];
public tipoModeloCtrl : FormControl = new FormControl();
public tipoModeloFiltrosCtrl : FormControl = new FormControl();
public filtrotipoModelo : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);

  constructor(public dialogRef: MatDialogRef<ModalConsumiblesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _proveeduriaService : ProveeduriaService,
    private formBuilder : FormBuilder,
    private toast: ToastrService,
    private _solicitudesService : SolicitudesService) {
      this.formularioImpresora = formBuilder.group({
        idTipoImpresora : new FormControl('', ),
        idDetalleImpresoraPk : new FormControl(''),
        idModeloBnFk : new FormControl('', Validators.required),
        codigoBdv : new FormControl('', Validators.required),
        descripcion : new FormControl('', Validators.required),       
        estatus: new FormControl('', Validators.required),
        modelo: new FormControl('')
      });
     }

  ngOnInit(): void {
    if(this.data != undefined ){
      this.tituloModal = this.formularioImpresora.value?.descripcion;
      this.buttonModificar = true;
      this.buttonCrear = false;
      this.tituloModal = 'Modificacion de consumible';
    }else{
      this.tituloModal = 'Creación de consumible';
      this.buttonModificar = false;
      this.buttonCrear = true;
    }
    this.obternerTipoImpresora();
    this.llenarObjectoInicial();
    this.mostrarModelo(this.formularioImpresora.getRawValue().idTipoImpresora);
  
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

  llenarObjectoInicial(){
    if(this.data != undefined ){


      this.formularioImpresora = this.formBuilder.group({
        idTipoImpresora : new FormControl({value :this.data.articulo.idTipoImpresora,  disabled: true}),
        idDetalleImpresoraPk : new FormControl( this.data.articulo.idDetalleImpresoraPk),
        idModeloBnFk : new FormControl({value :this.data.articulo.idModeloBnFk,  disabled: true}),
        codigoBdv :  new FormControl(this.data.articulo.codigoBdv),
        descripcion :  new FormControl(this.data.articulo.descripcion),
        estatus :  new FormControl(this.data.articulo.estatus),
        modelo :  new FormControl( this.data.articulo.modelo)
      });


    }else{
      this.formularioImpresora = this.formBuilder.group({
        idTipoImpresoraFk : new FormControl(''),
        descripcion : new FormControl('', Validators.required),
        estatus: new FormControl('', Validators.required),
        idModeloBnFk :new FormControl('', Validators.required),
        codigoBdv : new FormControl('', Validators.required),
        modelo :new FormControl('', Validators.required)
      });
    }
    
  }

  onChange(ev: MatSelectChange){  
      
      this.mostrarModelo(ev.value);
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

  cerrarModal(){
    this.dialogRef.close();
  }

  mostrarModelo(idModelo : any){

    
    this._solicitudesService.modeloImpresora(idModelo).subscribe(
      (response) => {
        this.tipoModelo.length = 0;      
        this.tipoModelo.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){  
          for(const iterator of response.data){
              this.tipoModelo.push({name:iterator.descripcion, id:iterator.idModeloBnPk})             
          }         
        }   
        this.tipoModeloCtrl.setValue(this.tipoModelo);
        this.filtrotipoModelo.next(this.tipoModelo);
        this.tipoModeloFiltrosCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filtrotipoModeloT();
        });
      }
    );

    }

  gestionImpresora(accion: any){
    if(accion == 'M'){
        this.modificarConsumible();
    }else if(accion == 'C'){
      this.guardarConsumible();
    }
  }

  guardarConsumible(){
    if(this.formularioImpresora.valid){
      
      this._proveeduriaService.creacionConsumible(this.formularioImpresora.value).subscribe(
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

  
  modificarConsumible(){      
   if(this.formularioImpresora.valid){    
      this._proveeduriaService.modificarConsumible(this.formularioImpresora.getRawValue()).subscribe(
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

//#region  filtros de los select
  protected filtrotipoModeloT() {
    if (!this.tipoModelo) {
      return;
    }
    // get the search keyword
    let search = this.tipoModeloFiltrosCtrl.value;
    if (!search) {
      this.filtrotipoModelo.next(this.tipoModelo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtrotipoModelo.next(
      this.tipoModelo.filter(tipo => tipo.name.toLowerCase().indexOf(search) > -1)
    );
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
  //#endregion
}
