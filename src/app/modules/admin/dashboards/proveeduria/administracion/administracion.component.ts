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
import { ModalConsumiblesComponent } from './modal-consumibles/modal-consumibles.component';
import { ModalImpresoraComponent } from './modal-impresora/modal-impresora.component';
import { ModalModeloImpresoraComponent } from './modal-modelo-impresora/modal-modelo-impresora.component';

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

  tablaArticulos : boolean = false;
  tablaConsumible : boolean = false;
  tablaImpresora : boolean = false;
  tablaModelo : boolean = false;
  tablaDetalle : boolean = false;

  //#region  Table Articulos y formulario 
  displayedColumnsP: string[] = ['codArticulo', 'iddercripciónArt', 'dercripciónArt','unidadVenta','tipoArt', 'acciones'];
  positionOptionsP: TooltipPosition[] = ['below'];
  positionP = new FormControl(this.positionOptionsP[0]);
  dataSourceP: MatTableDataSource<any>;
  dataSource: MatTableDataSource<solicitudesDto>;   
  ELEMENT_DATAP: articulo[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort;  
  filtroTabla : any;
//#endregion

 //#region  impresora
 displayedColumnsI: string[] = ['idTipoImpresora', 'descripcion', 'estatus','acciones'];
 positionOptionsI: TooltipPosition[] = ['below'];
 position = new FormControl(this.positionOptionsP[0]); 
 dataSourceI: MatTableDataSource<any>;   
 ELEMENT_DATAI: any[] = [];
 @ViewChild(MatPaginator) paginatorI: MatPaginator | any;
 @ViewChild(MatSort) sortI: MatSort = new MatSort;  
 filtroTablaI : any;
//#endregion

 //#region  impresora
 displayedColumnsM: string[] = ['idTipoImpresora', 'tipoImpresora','descripcion', 'estatus','acciones'];
 positionOptionsM: TooltipPosition[] = ['below'];
 positionM = new FormControl(this.positionOptionsP[0]); 
 dataSourceM: MatTableDataSource<any>;    
 @ViewChild(MatPaginator) paginatorM: MatPaginator | any;
 @ViewChild(MatSort) sortM: MatSort = new MatSort;  
 filtroTablaM : any;
//#endregion


 //#region Detalle impresora
 displayedColumnsD: string[] = ['idTipoImpresora', 'tipoImpresora', 'modelo', 'descripcion', 'modeloConsumible', 'codigo', 'estatus','acciones'];
 positionOptionsD: TooltipPosition[] = ['below'];
 positionD = new FormControl(this.positionOptionsP[0]); 
 dataSourceD: MatTableDataSource<any>;    
 @ViewChild(MatPaginator) paginatorD: MatPaginator | any;
 @ViewChild(MatSort) sortD: MatSort = new MatSort;  
 filtroTablaD : any;
//#endregion




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

  //#region tabla articulos y formularios 
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
    this.tablaArticulos = false; 
    this.tablaConsumible = false;  
  }else if(ev.value === 3){
    this.crearButton = false;
    this.tablaArticulos = false
    this.tablaConsumible = true;
  }else{
    this.crearButton = true;
    this.tablaArticulos = true;
    this.tipoCreacion = ev.source.triggerValue.toLowerCase();
    this.tablaConsumible = false;
  }
    this.tablaImpresora = false;
    this.tablaDetalle = false;
    this.filtroTabla = "";
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


  tipoConsumibles(ev: MatSelectChange){
    if(ev.value === "I"){
      this.ObetenerTipoImpresora();
      this.tablaImpresora = true;
      this.tablaModelo = false;
      this.tablaDetalle = false;
    }else if(ev.value === "M"){
      this.ObetenerModelompresora();
      this.tablaImpresora = false;
      this.tablaModelo = true;
      this.tablaDetalle = false;
    }else if(ev.value === "C"){
      this.tablaImpresora = false;
      this.tablaModelo = false;
      this.tablaDetalle = true;
      this.DetalleImpresora();
    }
  }

  ObetenerTipoImpresora(){
    this._proveduriaService.tipoImpresoraAdmin().subscribe(
      (response) => {
        this.dataSourceI = new MatTableDataSource(response.data);
        this.dataSourceI.paginator = this.paginatorI;
        this.dataSourceI.sort = this.sortI;        
      }
    );
  }

  ObetenerModelompresora(){
    this._proveduriaService.modeloImpresora().subscribe(
      (response) => {
        this.dataSourceM = new MatTableDataSource(response.data);
        this.dataSourceM.paginator = this.paginatorM;
        this.dataSourceM.sort = this.sortM;        
      }
    );
  }

  DetalleImpresora(){
    this._proveduriaService.detalleImpresora().subscribe(
      (response) => {
        console.log(response.data)
        this.dataSourceD = new MatTableDataSource(response.data);
        this.dataSourceD.paginator = this.paginatorD;
        this.dataSourceD.sort = this.sortD;        
      }
    );
  }

  openDialogImpresoraEdit(row: any): void {
    const dialogRef = this.dialog.open(ModalImpresoraComponent,{
      data: {articulo : row},
      width: '70%',
      disableClose: true
    })
    
    dialogRef.afterClosed().subscribe(result => {          
        if(result){
          const  indice = this.dataSourceI.data.findIndex(elemento => elemento.idTipoImpresoraPk === result.idTipoImpresoraPk);          
          this.dataSourceI.data[indice] = result;
          this.dataSourceI.paginator = this.paginator;
          this.dataSourceI.sort = this.sort;  
        }
    });
  }

  openDialogCrearImpresora(){
    const dialogRef = this.dialog.open(ModalImpresoraComponent,{      
      width: '70%',
      disableClose: false
    })
    
    dialogRef.afterClosed().subscribe(result => {           
        if(result){
          this.ObetenerTipoImpresora();
        }
    });
  }

  openDialogCrearModeloImpresora(){
    const dialogRef = this.dialog.open(ModalModeloImpresoraComponent,{      
      width: '70%',
      disableClose: false
    })
    
    dialogRef.afterClosed().subscribe(result => {           
        if(result){
          this.ObetenerModelompresora();
        }
    });
  }

  openDialogModeloEdit(row: any): void {
    const dialogRef = this.dialog.open(ModalModeloImpresoraComponent,{
      data: {articulo : row},
      width: '70%',
      disableClose: true
    })
    
    dialogRef.afterClosed().subscribe(result => {          
        if(result){
          this.ObetenerModelompresora();
        }
    });
  }

  openDialogConsumibleEdit(row: any): void {
    console.log(row)
    const dialogRef = this.dialog.open(ModalConsumiblesComponent,{
      data: {articulo : row},
      width: '70%',
      disableClose: true
    })
    
    dialogRef.afterClosed().subscribe(result => {          
        if(result){
          this.DetalleImpresora();
        }
    });
  }

  openDialogConsumible(){
    const dialogRef = this.dialog.open(ModalConsumiblesComponent,{      
      width: '70%',
      disableClose: false
    })
    
    dialogRef.afterClosed().subscribe(result => {           
        if(result){
          this.DetalleImpresora();
        }
    });
  }


}
