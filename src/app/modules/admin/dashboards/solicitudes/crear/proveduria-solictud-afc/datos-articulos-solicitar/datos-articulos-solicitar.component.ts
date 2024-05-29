import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ISelect } from 'app/models/login';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { OverlayRef, ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import {  takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-datos-articulos-solicitar',
  templateUrl: './datos-articulos-solicitar.component.html',
  styleUrls: ['./datos-articulos-solicitar.component.scss']
})
export class DatosArticulosSolicitarComponent implements OnInit {
 artFormulario: FormGroup; 

 
/*  IdTipoArticulo : any = null; 
  DescrArt        : any = null; 
  descrTipoImpre  : any = null; 
  descTipoModelo  : any = null; 
  direccionIp     : any = null;
  cantidadArt     : any = null;  */
  hasError :boolean = false;
  isShown:  boolean = false;
  isShownC: boolean = false; 
    //#region Select

    protected tipoArticulo : ISelect[] = [];
    public tipoArticuloCtrl : FormControl = new FormControl();
    public tipoArticuloFiltrosCtrl : FormControl = new FormControl();
    public filtrotipoArticulo : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
   

    protected tipoImpresora : ISelect[] = [];
    public tipoImpresoraCtrl : FormControl = new FormControl();
    public tipoImpresoraFiltrosCtrl : FormControl = new FormControl();
    public filtrotipoImpresora : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
   
    protected tipoModelo : ISelect[] = [];
    public tipoModeloCtrl : FormControl = new FormControl();
    public tipoModeloFiltrosCtrl : FormControl = new FormControl();
    public filtrotipoModelo : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
     
    protected descrArticulo : ISelect[] = [];
    public descrArticuloCtrl : FormControl = new FormControl();
    public descrArticuloFiltrosCtrl : FormControl = new FormControl();
    public filtrodescrArticulo : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
       //#endregion

   
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
  


  constructor(public dialogRef: MatDialogRef<DatosArticulosSolicitarComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
               private _loginService : LoginService, 
              private _solicitudesService : SolicitudesService,
              public dialog: MatDialog,          
              private formBuilder : FormBuilder,              
              private toast: ToastrService,) {

                this.artFormulario = formBuilder.group({
                  IdTipoArticulo:  new FormControl('', [Validators.required]),
                  descrTipoArt:  new FormControl(''),
                  idDescrArt: new FormControl('') ,
                  DescrArt:  new FormControl(''),
                  idTipoImpre: new FormControl(''),
                  descrTipoImpre:  new FormControl(''),
                  idTipoModelo:  new FormControl(''),
                  descTipoModelo:  new FormControl(''),
                  direccionIp:  new FormControl(''),
                  cantidad:  new FormControl(''),
                })


     }

  ngOnInit(): void {
    this.obtenerTipoArticulo(); 

 

  }

  ngAfterViewInit() {

    this.tipoArticuloCtrl.setValue(this.tipoArticulo);
    this.filtrotipoArticulo.next(this.tipoArticulo);
    this.tipoArticuloFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtrotipoArticuloT();
      
    });
  
  
     this.tipoImpresoraCtrl.setValue(this.tipoImpresora);
    this.filtrotipoImpresora.next(this.tipoImpresora);
    this.tipoImpresoraFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtrotipoImpresoraT();
      
    });
                
                
    this.tipoModeloCtrl.setValue(this.tipoModelo);
    this.filtrotipoModelo.next(this.tipoModelo);
    this.tipoModeloFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtrotipoModeloT();
    });
             
    this.descrArticuloCtrl.setValue(this.descrArticulo);
    this.filtrodescrArticulo.next(this.descrArticulo);
    this.descrArticuloFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtrodescrArticuloT();
    });              
    //#endregion
}

  async obtenerTipoArticulo(){


      
  
    this._solicitudesService.tipoArticulo().subscribe(
      (response) =>{ 
  
        this.tipoArticulo.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
          for(const iterator of response.data){
            this.tipoArticulo.push({name: iterator.nombre, id:iterator.idTipoArticuloPk})
          }
       
        }
               
      }, 
  
    );
  
    
   
  }  

  mostrarInput(){
    debugger

    if (this.artFormulario.value.IdTipoArticulo?.id != 3) {
      this.isShown = true;
      this.isShownC = false;

  

    this._solicitudesService.detalleArticulo(this.artFormulario.value.IdTipoArticulo?.id).subscribe(
      (response) => {
   
        this.descrArticulo.length = 0;
    

        this.descrArticulo.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
  
          for(const iterator of response.data){
              this.descrArticulo.push({name:iterator.descripcion, id:iterator.codigoBdv})             
          }
    
        }
        this.descrArticuloCtrl.setValue(this.descrArticulo);
        this.filtrodescrArticulo.next(this.descrArticulo);
        this.descrArticuloFiltrosCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filtrodescrArticuloT();
        });
        
      }
    );
    } else {
debugger
      this.isShownC = true;
      this.isShown = false;
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


    mostrarModelo(){
debugger
      console.log(this.artFormulario.value.idTipoImpre?.id)
    
      this._solicitudesService.modeloImpresora(this.artFormulario.value.idTipoImpre?.id).subscribe(
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
  
  onNoClick(): void {
    this.dialogRef.close();
  } 
  
  

  asignar(){
    this.hasError = true;
if (this.artFormulario.valid) {
  if (this.artFormulario.value.IdTipoArticulo.id != 3) {
  

    this.artFormulario = this.formBuilder.group({
      idDescrArt: new FormControl('', [Validators.required]) ,
      cantidad:  new FormControl('', [Validators.required]),
    })
    return;

    
  }else {
    
    this.artFormulario = this.formBuilder.group({
  
      idTipoImpre: new FormControl('', [Validators.required]),
      idTipoModelo:  new FormControl('', [Validators.required]),
      direccionIp:  new FormControl('', [Validators.required]),
      cantidad:  new FormControl('', [Validators.required]),
    })

    return;
  
  }
} else {

 
    return;
}    


      this.dialogRef.close();
  
     
  
  
  }

  protected filtrotipoArticuloT() {
    if (!this.tipoArticulo) {
      return;
    }
    // get the search keyword
    let search = this.tipoArticuloFiltrosCtrl.value;
    if (!search) {
      this.filtrotipoArticulo.next(this.tipoArticulo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtrotipoArticulo.next(
      this.tipoArticulo.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
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
  
  
  protected filtrodescrArticuloT() {
    if (!this.descrArticulo) { 
      return;
    }
    // get the search keyword
    let search = this.descrArticuloFiltrosCtrl.value;
    if (!search) {
      this.filtrodescrArticulo.next(this.descrArticulo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtrodescrArticulo.next(
      this.descrArticulo.filter(tipo => tipo.name.toLowerCase().indexOf(search) > -1)
    );
  }
  
  
  //#endregion

}
