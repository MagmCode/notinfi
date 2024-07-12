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
import { servicioGenerales } from 'app/models/infraestructura';
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

@Component({
  selector: 'app-administracion-servgenerales',
  templateUrl: './administracion-servgenerales.component.html',
  styleUrls: ['./administracion-servgenerales.component.scss']
})
export class AdministracionServgeneralesComponent implements OnInit {
  user = {} as User;
  usuario = {} as any;  
  datosSolicitud = {} as servicioGenerales;
  crearButton : boolean;  
  idTipoSolicitud : any;
  tipoCreacion : string;

  displayedColumnsP: string[] = [ 'detalleSol','requiereAprobacion','tiempoRespuestaNum',  'estatus','acciones'];
  positionOptionsP: TooltipPosition[] = ['below'];
  positionP = new FormControl(this.positionOptionsP[0]);
  dataSourceP: MatTableDataSource<servicioGenerales>;
  dataSource: MatTableDataSource<solicitudesDto>;   
  ELEMENT_DATAP: servicioGenerales[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort;  


  protected ListTipoSolicitud : ISelect[] = [];
  public ListTipoSolicitudCtrl : FormControl = new FormControl();
  public ListTipoSolicitudFiltrosCtrl : FormControl = new FormControl();
  public filtroListTipoSolicitud : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
 
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
    this.obtenerListTipoSolicitud();
    this.ngAfterViewInit();
    this.crearButton = false;
  }


  

  ngAfterViewInit() {
    this.ListTipoSolicitudCtrl.setValue(this.ListTipoSolicitud);
    this.filtroListTipoSolicitud.next(this.ListTipoSolicitud);
    this.ListTipoSolicitudFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtroListTipoSolicitudT();
      
    });
  }

  
 //#region select de tipo articulo
 protected filtroListTipoSolicitudT() {
  if (!this.ListTipoSolicitud) {
    return;
  }
  // get the search keyword
  let search = this.ListTipoSolicitudFiltrosCtrl.value;
  if (!search) {
    this.filtroListTipoSolicitud.next(this.ListTipoSolicitud.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the personals
  this.filtroListTipoSolicitud.next(
    this.ListTipoSolicitud.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
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

  async obtenerListTipoSolicitud(){  
    this._solicitudesService.tipoSolicitudServGene().subscribe(
      
      (response) =>{   
             
        this.ListTipoSolicitud.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
  
          for(const iterator of response.data){
              this.ListTipoSolicitud.push({name:iterator.nombre, id:iterator.idTipoSolicitudPk})             
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

    this.busquedaTipoSolicitudDetalle(ev.value);
  }


  busquedaTipoSolicitudDetalle(data : any){
    
   this._solicitudesService.tipoSolicitudDetalleServGene(data).subscribe(
    (response) => {
console.log(response.data)
      if(response.estatus == 'SUCCESS'){
        this.dataSourceP = new MatTableDataSource(response.data);
        this.dataSourceP.paginator = this.paginator;
        this.dataSourceP.sort = this.sort;   
       
  
      }
      
    }
  ); 
   
  }

  openDialogEdit(row: any): void {
/*     const dialogRef = this.dialog.open(EditarComponent,{
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
    }); */
  }

  openDialogCrear(): void {
/*     let  desctipoArticulo = document.querySelector('#selectart')?.textContent;
    let  tipoArticulo =   this.idTipoArticulo;
    let obj = {
        tipoArticulo : tipoArticulo,
        desctipoArticulo : desctipoArticulo
    }   */ 

/*     const dialogRef = this.dialog.open(CrearComponent,{
      data: {articulo : obj},
      width: '70%',
      disableClose: false
    }) */
    
 /*    dialogRef.afterClosed().subscribe(result => {     
        if(result){
          this.busquedaTipoFormulario(result.idTipoArticuloFk);
        }
    }); */
  }

  tablePaginacion(){
    this.dataSourceP.paginator = this.paginator;
    this.dataSourceP.sort = this.sort;      
  }


}
