import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { ISelect } from 'app/models/login';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-mediciones',
  templateUrl: './mediciones.component.html',
  styleUrls: ['./mediciones.component.scss']
})
export class MedicionesComponent implements OnInit {
  usuario = {} as any;
  //#region Select de Categoria
  protected categoria : ISelect[] = [];
  public categoriaCtrl : FormControl = new FormControl();
  public categoriaFiltrosCtrl : FormControl = new FormControl();
  public filtrocategoria : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
  //#endregion


    //#region Select de tipo servicio
    protected tipoServicio : ISelect[] = [];
    public tipoServicioCtrl : FormControl = new FormControl();
    public tipoServicioFiltrosCtrl : FormControl = new FormControl();
    public filtrotipoServicio : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
    //#endregion

    solFormulario: FormGroup;
    
    protected _onDestroy = new Subject<void>();
  
  
  constructor(private _solicitudesService : SolicitudesService,    
              private formBuilder : FormBuilder,              
              private _loginService : LoginService ) {


                this.solFormulario = formBuilder.group({
     
                  categoria: new FormControl('', [Validators.required]),
                  tiposerv :new FormControl('', [Validators.required]),
                
            })

               }

  ngOnInit(): void {

    
     //#region select de categoria
     this.obtenerCategorias();
     this.categoriaCtrl.setValue(this.categoria);
     this.filtrocategoria.next(this.categoria);
     this.categoriaFiltrosCtrl.valueChanges
     .pipe(takeUntil(this._onDestroy))
     .subscribe(() => {
       this.filtroCategoriaT();
     });
 //#endregion

 
//#region select de tipoServicio
     this.tipoServicioCtrl.setValue(this.tipoServicio);
     this.filtrotipoServicio.next(this.tipoServicio);
     this.tipoServicioFiltrosCtrl.valueChanges
     .pipe(takeUntil(this._onDestroy))
     .subscribe(() => {
       this.filtrotipoServicioT();
     });
 //#endregion
  }
  @ViewChild('matRef') matRef: MatSelect;
  clear(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  async obtenerCategorias(){

 
    await this._solicitudesService.consultarCategorias().subscribe(
      (response) => {
     
        this.categoria.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
          for(const iterator of response.data){
            this.categoria.push({name: iterator.nombre, id:iterator.idCategoria})
          }
        }
        
      }
    );
   
  }  

buscarTipoServicio(){    
   
    this._solicitudesService.consultarTipoServicio(this.solFormulario.value.categoria?.id).subscribe(
      (response) => {
    
        this.tipoServicio.length = 0;
        this.tipoServicio.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
          for(const iterator of response.data){
            this.tipoServicio.push({name: iterator.nombre, id: iterator.idTipoServicio})
          }
        }
        
      }
    );
  
   
  }

  buscarServicio(){    

    this.usuario = this._loginService.obterTokenInfo();

    this._solicitudesService.consultarServicio(this.solFormulario.value.tiposerv?.id,  this.usuario.nivelCargo).subscribe(
      (response) => {
      
        
      }
    );
  
  
  }
 //#region  inicializador de select
 protected filtroCategoriaT() {
  if (!this.categoria) {
    return;
  }
  // get the search keyword
  let search = this.categoriaFiltrosCtrl.value;
  if (!search) {
    this.filtrocategoria.next(this.categoria.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtrocategoria.next(
    this.categoria.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
  );
}


protected filtrotipoServicioT() {
  if (!this.tipoServicio) {
    return;
  }
  // get the search keyword
  let search = this.tipoServicioFiltrosCtrl.value;
  if (!search) {
    this.filtrotipoServicio.next(this.tipoServicio.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtrotipoServicio.next(
    this.tipoServicio.filter(tipo => tipo.name.toLowerCase().indexOf(search) > -1)
  );
}

}
