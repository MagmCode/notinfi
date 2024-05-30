import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ISelect } from 'app/models/login';
import { articulo } from 'app/models/proveduria';
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
datosArticulo = {} as articulo;
 

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
     

    protected descConsumible : ISelect[] = [];
    public descConsumibleCtrl : FormControl = new FormControl();
    public descConsumibleFiltrosCtrl : FormControl = new FormControl();
    public filtrodescConsumible : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
     


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
                  idDescConsumible:  new FormControl(''),
                  descConsumible:  new FormControl(''),
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
             
    this.descConsumibleCtrl.setValue(this.descConsumible);
    this.filtrodescConsumible.next(this.descConsumible);
    this.descConsumibleFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtrodescConsumibleT();
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


    if (this.artFormulario.value.IdTipoArticulo?.id != 3) {
      this.isShown = true;
      this.isShownC = false;

  

    this._solicitudesService.detalleArticulo(this.artFormulario.value.IdTipoArticulo?.id).subscribe(
      (response) => {
   
        this.descrArticulo.length = 0;
    

        this.descrArticulo.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
  
          for(const iterator of response.data){
              this.descrArticulo.push({name:iterator.descripcion, id:iterator.idArticuloPk + '-' +iterator.codigoBdv})             
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

    this.artFormulario = this.formBuilder.group({
      IdTipoArticulo:  new FormControl(this.artFormulario.value.IdTipoArticulo,  [Validators.required]),
      idDescrArt: new FormControl('', [Validators.required]) ,
      cantidad:  new FormControl('', [Validators.required]),
    })

    } else {


      
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


      this.artFormulario = this.formBuilder.group({
        IdTipoArticulo:  new FormControl(this.artFormulario.value.IdTipoArticulo,  [Validators.required]),
        idTipoImpre: new FormControl('', [Validators.required]),
        idTipoModelo:  new FormControl('', [Validators.required]),
        idDescConsumible:  new FormControl('', [Validators.required]),
        direccionIp:  new FormControl('', [Validators.required]),
        cantidad:  new FormControl('', [Validators.required]),
      })
  
    }

    }


    mostrarModelo(){

 
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

      
    mostrardescConsumible(){
      
        
            this._solicitudesService.detalleImpresora(this.artFormulario.value.idTipoModelo?.id).subscribe(
              (response) => {
                this.descConsumible.length = 0;
        
              
                this.descConsumible.push({name: 'Selecciones', id:''});
                if(response.estatus == 'SUCCESS'){
          
                  for(const iterator of response.data){
                      this.descConsumible.push({name:iterator.descripcion +'-'+ iterator.modelo, id:iterator.idDetalleImpresoraPk +'-'+  iterator.codigoBdv })             
                  }
                 
                }
                              
                    
                this.descConsumibleCtrl.setValue(this.descConsumible);
                this.filtrodescConsumible.next(this.descConsumible);
                this.descConsumibleFiltrosCtrl.valueChanges
                .pipe(takeUntil(this._onDestroy))
                .subscribe(() => {
                  this.filtrodescConsumibleT();
                });
              }
            );
      
            }
  
  onNoClick(): void {
    this.dialogRef.close();
  } 
  
  

  asignar(){


this.datosArticulo = {} as articulo;
if (this.artFormulario.valid) {
  if (this.artFormulario.value.IdTipoArticulo.id != 3) {
  

     
let cod: string[] =  this.artFormulario.value.idDescrArt.id.split('-');


    this.datosArticulo.idTipoArt = this.artFormulario.value.IdTipoArticulo.id;
    this.datosArticulo.descrTipoArt = this.artFormulario.value.IdTipoArticulo.name;
    this.datosArticulo.codArticulo = cod[1];
    this.datosArticulo.idDescrArt = cod[0];
    this.datosArticulo.dercripcionArt  = this.artFormulario.value.idDescrArt.name;  
    this.datosArticulo.cantidadArt  = this.artFormulario.value.cantidad;
    this.datosArticulo.idTipoImpre =  ' ';
    this.datosArticulo.tipoImpresora =  ' ';
    this.datosArticulo.direccionIp =  ' ';
    this.datosArticulo.idDescConsumible =  ' ';
    this.datosArticulo.descConsumible =  ' ';
    this.datosArticulo.modeloConsumible =  ' ';   



  this.dialogRef.close(this.datosArticulo);

   

    
  }else {


    let cod: string[] =  this.artFormulario.value.idDescConsumible.id.split('-');
    let codM: string[] =  this.artFormulario.value.idDescConsumible.name.split('-');
    this.datosArticulo.idTipoArt = this.artFormulario.value.IdTipoArticulo.id;
    this.datosArticulo.descrTipoArt = this.artFormulario.value.IdTipoArticulo.name;
    this.datosArticulo.codArticulo = cod[1];
    this.datosArticulo.idDescrArt = this.artFormulario.value.idTipoModelo.id;
    this.datosArticulo.dercripcionArt  = this.artFormulario.value.idTipoModelo.name;  
    this.datosArticulo.cantidadArt  = this.artFormulario.value.cantidad;
    this.datosArticulo.idTipoImpre =  this.artFormulario.value.idTipoImpre.id;
    this.datosArticulo.tipoImpresora =  this.artFormulario.value.idTipoImpre.name;
    this.datosArticulo.direccionIp =  this.artFormulario.value.direccionIp;
    this.datosArticulo.idDescConsumible =  cod[0];
    this.datosArticulo.descConsumible =  codM[0];
    this.datosArticulo.modeloConsumible =  codM[1];  

 
  




    this.dialogRef.close(this.datosArticulo); 
  
  }
} else {

 
    return;
}    


    
  
     
  
  
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
  

  protected filtrodescConsumibleT() {
    if (!this.descConsumible) {
      return;
    }
    // get the search keyword
    let search = this.descConsumibleFiltrosCtrl.value;
    if (!search) {
      this.filtrodescConsumible.next(this.descConsumible.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtrodescConsumible.next(
      this.descConsumible.filter(tipo => tipo.name.toLowerCase().indexOf(search) > -1)
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
