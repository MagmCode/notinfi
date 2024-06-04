import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { ISelect } from 'app/models/login';
import { articulo } from 'app/models/proveduria';
import { solicitudesDto } from 'app/models/usuario';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit {
  user = {} as User;
  usuario = {} as any;
  artFormulario: FormGroup; 
  datosArticulo = {} as articulo

  displayedColumnsP: string[] = ['tipoArt', 'dercripciónArt', 'cantidadArt','unidadVenta','direccionIp','tipoImpresora', 'descConsumible' ,'modeloConsumible'];
  positionOptionsP: TooltipPosition[] = ['below'];
  positionP = new FormControl(this.positionOptionsP[0]);
  dataSourceP: MatTableDataSource<articulo>;
  dataSource: MatTableDataSource<solicitudesDto>;   
  ELEMENT_DATAP: articulo[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort;  


  protected tipoArticulo : ISelect[] = [];
    public tipoArticuloCtrl : FormControl = new FormControl();
    public tipoArticuloFiltrosCtrl : FormControl = new FormControl();
    public filtrotipoArticulo : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
    protected _onDestroy = new Subject<void>();

    
  constructor(private _loginService : LoginService,  
    private _loginservices: LoginService,
    private _solicitudesService : SolicitudesService,              
    private formBuilder : FormBuilder, 
    private route: ActivatedRoute ,
    private toast: ToastrService,
    private spinner: NgxSpinnerService,
    private _router: Router) {

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
    this.usuario = this._loginService.obterTokenInfo();
    this.user.name = this.usuario.nombres + ' ' +this.usuario.apellidos;  
    this.user.email =this.usuario.descCargo; 
    this.obtenerTipoArticulo();
    this.ngAfterViewInit();
  }


  applyFilterP(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceP.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceP.paginator) {
      this.dataSourceP.paginator.firstPage();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  } 

  async obtenerTipoArticulo(){
  
    this._solicitudesService.tipoArticulo().subscribe(
      (response) =>{ 
        console.log(response)
        this.tipoArticulo.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
          for(const iterator of response.data){
            this.tipoArticulo.push({name: iterator.nombre, id:iterator.idTipoArticuloPk})
          }
       
        }
        console.log(this.tipoArticulo)
               
      }, 
  
    );
  }  

}
