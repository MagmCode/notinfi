import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { solicitudesDto } from 'app/models/usuario';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { Overlay, OverlayRef } from 'ngx-toastr';

@Component({
  selector: 'app-buzon-asignada',
  templateUrl: './buzon-asignada.component.html',
  styleUrls: ['./buzon-asignada.component.scss']
})
export class BuzonAsignadaComponent implements OnInit {
  user = {} as User;
  usuario = {} as any;
  plantillaUsuario = {} as solicitudesDto;

      //#region  tablas
      displayedColumns: string[] = ['Idsolicitud','area', 'categoria', 'tipoServicio', 'servicio', 'codigoUsuario', 'cedula', 'nombres', 'codUnidad','unidad','ubicacionFisica', 'fechaCreacion', 'estatus','nombresResp', 'acciones'];
     positionOptions: TooltipPosition[] = ['below'];
      position = new FormControl(this.positionOptions[0]);
      dataSource: MatTableDataSource<solicitudesDto>;    
      dataSourceP: MatTableDataSource<solicitudesDto>;
      ELEMENT_DATA: solicitudesDto[] = [];
      @ViewChild(MatPaginator) paginator: MatPaginator | any;
      @ViewChild(MatSort) sort: MatSort = new MatSort;  
     //#endregion
//#region toast
override2 = {
  positionClass: 'toast-bottom-full-width',
  closeButton: true,
  
};
//#endregion

  //#region  spinner
  private overlayRef!: OverlayRef;
  //#endregion
  
  constructor(private _loginService : LoginService,          
              private _loginservices: LoginService,
              private _solicitudesService : SolicitudesService,
              private overlay: Overlay,
              private _router: Router, ) { 


                this.dataSource = new MatTableDataSource(this.ELEMENT_DATA); 


              }

  ngOnInit(): void {

    this.obtenerPlantilla();
    this.usuario = this._loginService.obterTokenInfo();

    this.user.name = this.usuario.nombres + ' ' +this.usuario.apellidos;  
    this.user.email =this.usuario.descCargo; 
    console.log(this.user.name);


  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }



  async obtenerPlantilla(){
    this.usuario = this._loginservices.obterTokenInfo();
    console.log(this.usuario.codigo)
    this._solicitudesService.solicitudesAsignadasFlujo(this.usuario.codigo).subscribe(
    (response) =>{
        console.log(response)
        this.ELEMENT_DATA = [];
        this.ELEMENT_DATA = response.data;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.ngAfterViewInit();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }
    )
  }

  obtenerDatosApobar(idSolicitud: any){
     
    sessionStorage.setItem('idSolicitud', idSolicitud);
    this._router.navigate(['/buzon/detalleSolicitud']); 
  
  
  }

}
