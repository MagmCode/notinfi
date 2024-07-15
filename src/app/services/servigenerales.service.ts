import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServigeneralesService {
  urlEndPoint : string = '';
  constructor(private http : HttpClient) { 
    this.urlEndPoint = environment.urlEndPoint;
  }


  crearTipoSolicitudSerGen(nombre : any, estatus: any): Observable<any>{
    const url = this.urlEndPoint + 'crearTipoSolicitudSerGen';
    const dataBusqueda = {
      nombre : nombre,
      estatus :estatus
    };
    return this.http.post(url, dataBusqueda); 
  }

  crearTipoSolicitudDetalleSerGen(seviGenerale : any): Observable<any>{
    const url = this.urlEndPoint + 'crearTipoSolicitudDetalleSerGen';
   
    return this.http.post(url, seviGenerale); 
  }

  modificaTipoSolicitudSerGen(idTipoSolicitudPk: any,nombre : any, estatus: any): Observable<any>{
    const url = this.urlEndPoint + 'modificaTipoSolicitudSerGen';
    const dataBusqueda = {
      idTipoSolicitudPk: idTipoSolicitudPk, 
      nombre : nombre,
      estatus :estatus
    };
    return this.http.post(url, dataBusqueda); 
  }

  modificaTipoSolicitudDetSerGen(seviGenerale : any): Observable<any>{
    const url = this.urlEndPoint + 'modificaTipoSolicitudDetSerGen';
   
    return this.http.post(url, seviGenerale); 
  }

  onOffTipoSolicitudSerGen(idTipoSolicitudPk: any, estatus: any): Observable<any>{
    const url = this.urlEndPoint + 'onOffTipoSolicitudSerGen';
    const dataBusqueda = {
      idTipoSolicitudPk: idTipoSolicitudPk, 
      estatus :estatus
    };
    return this.http.post(url, dataBusqueda); 
  }

  onOffTipoSolicitudDetSerGen(idTipSolDetallePk: any, estatus: any): Observable<any>{
    const url = this.urlEndPoint + 'onOffTipoSolicitudDetSerGen';
    const dataBusqueda = {
      idTipSolDetallePk: idTipSolDetallePk, 
      estatus :estatus
    };
    return this.http.post(url, dataBusqueda); 
  }
}
