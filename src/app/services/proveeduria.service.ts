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

    crearArticulo(articulo : any): Observable<any>{
      const url = this.urlEndPoint + 'crearArticulo';
      return this.http.post(url, articulo); 
    }  

    modeloImpresora(): Observable<any>{
      const url = this.urlEndPoint + 'modeloImpresoraAdministrador';
      return this.http.post(url, ""); 
    }
    
    detalleImpresora(): Observable<any>{
      const url = this.urlEndPoint + 'detalleImpresoraAdministrador';
      return this.http.post(url, ""); 
    }

    modificarImpresora(articulo : any): Observable<any>{
      const url = this.urlEndPoint + 'modificaTipoImpresora';
      return this.http.post(url, articulo); 
    } 

    creacionImpresora(articulo : any): Observable<any>{
      const url = this.urlEndPoint + 'crearTipoImpresora';
      return this.http.post(url, articulo); 
    }

    creacionImpresoraModelo(articulo : any): Observable<any>{
      const url = this.urlEndPoint + 'crearModeloBn';
      return this.http.post(url, articulo); 
    }

    modificarImpresoraModelo(articulo : any): Observable<any>{
      const url = this.urlEndPoint + 'modificaModeloBn';
      return this.http.post(url, articulo); 
    }

    creacionConsumible(articulo : any): Observable<any>{
      const url = this.urlEndPoint + 'crearDetalleImpresora';
      return this.http.post(url, articulo); 
    }

    tipoImpresoraAdmin(): Observable<any>{
      const url = this.urlEndPoint + 'tipoImpresoraAdministrador';
      return this.http.post(url, ""); 
    }

    modificarConsumible(articulo : any): Observable<any>{
      const url = this.urlEndPoint + 'modificaDetalleImpresora';
      return this.http.post(url, articulo); 
    }
  }