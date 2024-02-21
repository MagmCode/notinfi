import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  urlEndPoint : string = '';
  constructor(private http : HttpClient) { 
    this.urlEndPoint = environment.urlEndPoint;
  }

  consultarCategorias(): Observable<any>{
    const url = this.urlEndPoint + 'categorias';
    return this.http.post(url, ''); 
  }


  consultarTipoServicio(categoria : any): Observable<any>{
    const url = this.urlEndPoint + 'tipoServicio';
    const dataBusqueda = {
      idCategoria : categoria
    };
    return this.http.post(url, dataBusqueda);
  }

  consultarServicio(tipoServicio : any): Observable<any>{
    const url = this.urlEndPoint + 'servicio';
    const dataBusqueda = {
      idTipoServicio : tipoServicio
    };
    return this.http.post(url, dataBusqueda);
  }

  consultarDetalleUsuario(codigoUsuario: any): Observable <any>{

    const url = this.urlEndPoint + 'ldapWS/detalleUsuario';
    const dataBusqueda = {
      codUsuario : codigoUsuario
    };
    return this.http.post(url, dataBusqueda);

  }

  consultarobtenerPlantilla(codigoUsuario: any, codigoUnidad: any): Observable <any>{

    const url = this.urlEndPoint + 'ldapWS/obtenerPlantilla';
    const dataBusqueda = {
      codUsuario : codigoUsuario,
      codUnidad: codigoUnidad
    };
    return this.http.post(url, dataBusqueda);

  }

  crear(usuario : any):Observable<any>{
    const url = this.urlEndPoint + '/crearSolicitud';
    const jsonEnvio = JSON.stringify(usuario);
    return this.http.post(url, usuario);
}

consultarSolicitudesCreadas(codigoUsuario: any): Observable <any>{

  const url = this.urlEndPoint + 'consultarSolicitudesCreadas';
  const dataBusqueda = {
    codUsuario : codigoUsuario
  };
  return this.http.post(url, dataBusqueda);

}

consultarSolicitudesAsignadas(codigoUsuario: any): Observable <any>{

  const url = this.urlEndPoint + 'consultarSolicitudesAsignadas';
  const dataBusqueda = {
    codUsuario : codigoUsuario
  };
  return this.http.post(url, dataBusqueda);

}

gestionFlujoTarea (solicitudesDto : any):Observable<any>{
  const url = this.urlEndPoint + '/gestionFlujoTarea ';
  const jsonEnvio = JSON.stringify(solicitudesDto);
  return this.http.post(url, solicitudesDto);
}

}
