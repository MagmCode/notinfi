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
observacion = new FormControl('');

evento = new FormControl('');

  hasError :boolean = false;
  isShown:  boolean = false;
  isShownC: boolean = false; 
  isShownO: boolean = false; 
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
                  id: new FormControl(''),
                  IdTipoArticulo:  new FormControl('', [Validators.required]),
                  idDescrArt: new FormControl('') ,
                  idTipoImpre: new FormControl(''),
                  idTipoModelo:  new FormControl(''),
                  idDescConsumible:  new FormControl(''),
                  direccionIp:  new FormControl(''),
                  cantidad:  new FormControl(''),
                  unidadV:  new FormControl(''),
                })


     }

  ngOnInit(): void {


 
this.obtenerTipoArticulo(); 

    if (this.data) {

      this.datosArticulo = this.data.articulo;
     


      this.artFormulario = this.formBuilder.group({
        IdTipoArticulo:  new FormControl( this.datosArticulo.idTipoArt),
       
      })
      this.mostrarInput();
  
      if (this.datosArticulo.idTipoArt != 3) {
     

       

        
        this.artFormulario = this.formBuilder.group({
          id: new FormControl( this.datosArticulo.relacion),
          IdTipoArticulo:  new FormControl( {value : Number(this.datosArticulo.idTipoArt) , disabled: true}),         
          idDescrArt: new FormControl( {value : this.datosArticulo.idDescrArt + '-' + this.datosArticulo.codArticulo + '-' + this.datosArticulo.unidadVenta, disabled: true}) ,
          idTipoImpre: new FormControl(''),
          idTipoModelo:  new FormControl(''),
          idDescConsumible:  new FormControl(''),
          direccionIp:  new FormControl(''),
          cantidad:  new FormControl(this.datosArticulo.cantidadArt),
          unidadV:  new FormControl({value : this.datosArticulo.unidadVenta, disabled: true}),
        })
       
      } else {
        this.artFormulario = this.formBuilder.group({
          idTipoImpre: new FormControl( this.datosArticulo.idTipoImpre),
          idTipoModelo:  new FormControl(this.datosArticulo.idDescrArt),
         
        })
        this.mostrarModelo()
        this.mostrardescConsumible();
    
        this.artFormulario = this.formBuilder.group({
          
          id: new FormControl( this.datosArticulo.relacion),
          IdTipoArticulo:  new FormControl({value : Number(this.datosArticulo.idTipoArt) , disabled: true}),         
          idDescrArt: new FormControl('') ,
          idTipoImpre: new FormControl({value : Number(this.datosArticulo.idTipoImpre), disabled: true}),
          idTipoModelo:  new FormControl(Number(this.datosArticulo.idDescrArt)),
          idDescConsumible:  new FormControl(this.datosArticulo.idDescConsumible  +'-'+ this.datosArticulo.codArticulo),
          direccionIp:  new FormControl(this.datosArticulo.direccionIp),
          cantidad:  new FormControl(this.datosArticulo.cantidadArt),
          unidadV:  new FormControl({value : this.datosArticulo.unidadVenta, readonly: true}),
        })

       
      }

      if (this.datosArticulo.evento != undefined) {
        this.isShownO = true;
        this.observacion = new FormControl(this.datosArticulo.observacion,Validators.required);
        this.evento = new FormControl(this.datosArticulo.evento);
      }

this.ngAfterViewInit();
      

    


    } 
 

 

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
    
var art ;
if (sessionStorage.getItem('idServicio')  == '4') {
  art = "A";
} else {
  art = "C";

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
    IdTipoArticulo:  new FormControl( {value : 3, disabled: true}),
    idTipoImpre: new FormControl('', [Validators.required]),
    idTipoModelo:  new FormControl('', [Validators.required]),
    idDescConsumible:  new FormControl('', [Validators.required]),
    direccionIp:  new FormControl('', [Validators.required]),
    cantidad:  new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
  })

}


    this._solicitudesService.tipoArticuloXservicio(art).subscribe(
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


    if (this.artFormulario.value.IdTipoArticulo != 3) {
      this.isShown = true;
      this.isShownC = false;

  

    this._solicitudesService.detalleArticulo(this.artFormulario.value.IdTipoArticulo).subscribe(
      (response) => {
   
        this.descrArticulo.length = 0;
    

        this.descrArticulo.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
  
          for(const iterator of response.data){
              this.descrArticulo.push({name:iterator.descripcion, id:iterator.idArticuloPk + '-' +iterator.codigoBdv  + '-' + iterator.unidadVenta})             
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
      cantidad:  new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
    })

    } 

    }


    mostrarUnidadV(){


      const cod: string[] =  this.artFormulario.value.idDescrArt.split('-');
      var uni = cod[2];



    this.artFormulario = this.formBuilder.group({
      IdTipoArticulo:  new FormControl(this.artFormulario.value.IdTipoArticulo,  [Validators.required]),
     
      idDescrArt: new FormControl(this.artFormulario.value.idDescrArt, [Validators.required]) ,
      cantidad:  new FormControl(this.artFormulario.value.cantidad, [Validators.required, Validators.pattern('^[0-9]+$')]),
    unidadV:  new FormControl(uni),
  }) 
 



    }

    mostrarModelo(){

 
      this._solicitudesService.modeloImpresora(this.artFormulario.value.idTipoImpre).subscribe(
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
      
        
            this._solicitudesService.detalleImpresora(this.artFormulario.value.idTipoModelo).subscribe(
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
  

  this.datosArticulo.relacion =this.artFormulario.getRawValue().id;
    this.datosArticulo.idTipoArt = this.artFormulario.getRawValue().IdTipoArticulo;
    this.datosArticulo.descrTipoArt = document.querySelector('#selectart')?.textContent;
   
    if ( this.evento.value != '') {
       
      this.datosArticulo.observacion = this.observacion.value;
      this.datosArticulo.evento = this.evento.value;
    }

  if (this.artFormulario.getRawValue().IdTipoArticulo != 3) {
  

let cod: string[] =  this.artFormulario.getRawValue().idDescrArt.split('-');


    this.datosArticulo.codArticulo = cod[1];
    this.datosArticulo.idDescrArt = cod[0];
    this.datosArticulo.dercripcionArt  = document.querySelector('#selectDescrArt')?.textContent;
    this.datosArticulo.cantidadArt  = this.artFormulario.getRawValue().cantidad;
    this.datosArticulo.idTipoImpre =  '';
    this.datosArticulo.tipoImpresora =  '';
    this.datosArticulo.direccionIp =  '';
    this.datosArticulo.idDescConsumible =  '';
    this.datosArticulo.descConsumible =  '';
    this.datosArticulo.modeloConsumible =  ''; 
    this.datosArticulo.unidadVenta = this.artFormulario.getRawValue().unidadV;  



  this.dialogRef.close(this.datosArticulo);

   

    
  }else {


    let cod: string[] =  this.artFormulario.getRawValue().idDescConsumible.split('-');
    let codM: string[] =  document.querySelector('#selectDescConsumible')?.textContent.split('-');
    this.datosArticulo.codArticulo = cod[1];
    this.datosArticulo.idDescrArt = this.artFormulario.getRawValue().idTipoModelo;
    this.datosArticulo.dercripcionArt  = document.querySelector('#selectTipoModelo')?.textContent;  
    this.datosArticulo.cantidadArt  = this.artFormulario.getRawValue().cantidad;
    this.datosArticulo.idTipoImpre =  this.artFormulario.getRawValue().idTipoImpre;
    this.datosArticulo.tipoImpresora =   document.querySelector('#selectTipoImpre')?.textContent;
    this.datosArticulo.direccionIp =  this.artFormulario.getRawValue().direccionIp;
    this.datosArticulo.idDescConsumible =  cod[0];
    this.datosArticulo.descConsumible =  codM[0];
    this.datosArticulo.modeloConsumible =  codM[1];  
    this.datosArticulo.unidadVenta = 'UNIDAD';
 
  




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
