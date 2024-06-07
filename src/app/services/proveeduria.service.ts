import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class ProveeduriaService {
    
    urlEndPoint : string = '';
    constructor(private http : HttpClient) { 
      this.urlEndPoint = environment.urlEndPoint;
    }

    consultarUnidadVenta(): Observable<any>{
        const url = this.urlEndPoint + 'unidadVenta';
        return this.http.post(url, ''); 
      }

    modificarArticulo(articulo : any): Observable<any>{
      const url = this.urlEndPoint + 'modificaArticulo';
      return this.http.post(url, articulo); 
    }  

    detalleArticuloAdministrador(idTipoArticuloFk : any): Observable<any>{
      const url = this.urlEndPoint + 'detalleArticuloAdministrador';
      const dataBusqueda = {
        idTipoArticuloFk : idTipoArticuloFk
      };
      return this.http.post(url, dataBusqueda);
    }
  }