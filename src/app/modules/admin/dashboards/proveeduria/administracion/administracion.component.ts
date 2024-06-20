import {  Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { ISelect } from 'app/models/login';
import { articulo } from 'app/models/proveduria';
import { solicitudesDto } from 'app/models/usuario';
import { LoginService } from 'app/services/login.service';
import { ProveeduriaService } from 'app/services/proveeduria.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CrearComponent } from './crear/crear.component';
import { EditarComponent } from './editar/editar.component';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.scss']
})
export class AdministracionComponent implements OnInit {
  user = {} as User;
  usuario = {} as any;  
  datosArticulo = {} as articulo
  crearButton : boolean;  
  idTipoArticulo : any;
  tipoCreacion : string;

  displayedColumnsP: string[] = ['codArticulo', 'iddercripciónArt', 'dercripciónArt','unidadVenta','tipoArt', 'acciones'];
  positionOptionsP: TooltipPosition[] = ['below'];
  positionP = new FormControl(this.positionOptionsP[0]);
  dataSourceP: MatTableDataSource<any>;
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
              private _solicitudesService : SolicitudesService,              
              public dialog: MatDialog,
              private _proveduriaService : ProveeduriaService) {

    
     }

  ngOnInit(): void {
    this.usuario = this._loginService.obterTokenInfo();
    this.user.name = this.usuario.nombres + ' ' +this.usuario.apellidos;  
    this.user.email =this.usuario.descCargo; 
    this.obtenerTipoArticulo();
    this.ngAfterViewInit();
    this.crearButton = false;
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

  
 //#region select de tipo articulo
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
  //#endregion

  //#region tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  } 

  applyFilterP(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceP.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceP.paginator) {
      this.dataSourceP.paginator.firstPage();
    }
  }
  //#endregion

  async obtenerTipoArticulo(){  
    this._solicitudesService.tipoArticulo().subscribe(
      (response) =>{        
        this.tipoArticulo.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
          for(const iterator of response.data){
            this.tipoArticulo.push({name: iterator.nombre, id:iterator.idTipoArticuloPk});            
          }
        }      
      }
    );
  }  

  onChange(ev: MatSelectChange){ 
  if(ev.value === ''){
    this.crearButton = false;
  }else{
    this.crearButton = true;
    this.tipoCreacion = ev.source.triggerValue.toLowerCase();
  }

    this.busquedaTipoFormulario(ev.value);
  }


  busquedaTipoFormulario(data : any){
    this._proveduriaService.detalleArticuloAdministrador(data).subscribe(
      (response) =>{                       
        if(response.estatus == 'SUCCESS'){          
            this.dataSourceP = new MatTableDataSource(response.data);
            this.dataSourceP.paginator = this.paginator;
            this.dataSourceP.sort = this.sort;        
        }      
      }
    );
  }

  openDialogEdit(row: any): void {
    const dialogRef = this.dialog.open(EditarComponent,{
      data: {articulo : row},
      width: '70%',
      disableClose: true
    })
    
    dialogRef.afterClosed().subscribe(result => {     
        if(result){
          const  indice = this.dataSourceP.data.findIndex(elemento => elemento.idArticuloPk === result.idArticuloPk);
          this.dataSourceP.data[indice] = result;
          this.tablePaginacion();
        }
    });
  }

  openDialogCrear(): void {
    let  desctipoArticulo = document.querySelector('#selectart')?.textContent;
    let  tipoArticulo =   this.idTipoArticulo;
    let obj = {
        tipoArticulo : tipoArticulo,
        desctipoArticulo : desctipoArticulo
    }   

    const dialogRef = this.dialog.open(CrearComponent,{
      data: {articulo : obj},
      width: '70%',
      disableClose: false
    })
    
    dialogRef.afterClosed().subscribe(result => {     
        if(result){
          this.busquedaTipoFormulario(result.idTipoArticuloFk);
        }
    });
  }

  tablePaginacion(){
    this.dataSourceP.paginator = this.paginator;
    this.dataSourceP.sort = this.sort;      
  }

}
