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

}
