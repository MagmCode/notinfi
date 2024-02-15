import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ISelect } from 'app/models/login';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
;

@Component({
  selector: 'app-crear',
  templateUrl: './crear.component.html',
  styleUrls: ['./crear.component.scss']
})
export class CrearComponent implements OnInit {

  //#region Select de Categoria
  protected categoria : ISelect[] = [];
  public categoriaCtrl : FormControl = new FormControl();
  public categoriaFiltrosCtrl : FormControl = new FormControl();
  public filtrocategoria : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
  //#endregion

    
  protected _onDestroy = new Subject<void>();

  constructor(private _solicitudesService : SolicitudesService) { }

  ngOnInit(): void {
      this.obtenerCategorias();
      this.categoriaCtrl.setValue(this.categoria);
      this.filtrocategoria.next(this.categoria);
      this.categoriaFiltrosCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtroCategoriaT();
      });

  }

  async obtenerCategorias(){
    await this._solicitudesService.consultarCategorias().subscribe(
      (response) => {
        console.log(response.data)
        this.categoria.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
          for(const iterator of response.data){
            this.categoria.push({name: iterator.nombre, id:iterator.idCategoria})
          }
        }
        
      }
    );
  }  


  obtenerTipoServicio(){
   
  }


  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
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
//#endregion
}
