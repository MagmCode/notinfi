import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { update } from 'lodash';
import { map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { AuthService } from 'app/core/auth/auth.service';
import { IntencionRetiro } from 'app/models/intencionRetiro';
import { IntencionVenta } from 'app/models/intencionVenta';
import { SustitucionesPendientesResponse } from 'app/models/sustituciones';


@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  // #region Variables

  private apiUrl: string = environment.urlEndPoint;
    // BehaviorSubject para almacenar los datos de la jornada activa
    jornadaActivaSource = new BehaviorSubject<any[]>([]);
    jornadaActiva$ = this.jornadaActivaSource.asObservable();
    // Para sustituciones pendientes
sustitucionesPendientesSource = new BehaviorSubject<any[]>([]);
sustitucionesPendientes$ = this.sustitucionesPendientesSource.asObservable();

    tasasSource = new BehaviorSubject<{
        compraUsd: string, 
        compraEur: string, 
        compraPTR: string, 
        compraCNY: string, 
        compraTRY: string, 
        compraRUB: string,
        fechaValor: string
    } | null>(null);
    tasas$ = this.tasasSource.asObservable();
    // jornadaActivaSource = new BehaviorSubject<any>(null);


    // #region Constructor
  //
  constructor(
    private http : HttpClient,
    private authService: AuthService,
  ) { }





  // #region intervencion
  // 
  // Consulta de intervenciones
  // 
  // 
  consultaIntervencion( metodo: string, dataBusqueda: any): Observable<any>{
    console.log("Data Busqueda:", dataBusqueda)
    const url = metodo;
    console.log("url: ", url)
    return this.http.post(`${this.apiUrl}api/bcv/${metodo}/`, dataBusqueda);
  }


  
exportarIntervencion( metodo: string, dataBusqueda: any): Observable<HttpEvent<Blob>> {
  const req = new HttpRequest(
    'POST',
    `${this.apiUrl}api/bcv/intervencionFiltro/exportar`, dataBusqueda,
    { responseType: 'blob',
      reportProgress: true,
     }
  );
  return this.http.request(req);
}

cerrarLotesOperaciones(data: { idsOper: any[], fechOper: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}api/bcv/cerrarLoteIntervencion`, data);
}

procesarOperaciones(data: { ids: any[], codigoJornada: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}api/bcv/enviarOperaciones`, data);
}





// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------


// #region Jornada
// 
// Consulta de jornada Activa
// 
// 
  consultaJornadaActiva(): Observable<any> {
    return this.http.get(`${this.apiUrl}api/bcv/jornadaActiva/`).pipe(
      map((response: any) => {
        this.jornadaActivaSource.next(response); // Actualiza el BehaviorSubject con los datos obtenidos
        return response;
      })
    );
  }


// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------------------


// #region Sustituciones Pendientes
// 
// Consulta para obtener las sustituciones pendientes
// 
// 
  consultaSustitucionesPendientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}api/bcv/jornadaActiva/`).pipe(
      map((response: any) => {
        this.jornadaActivaSource.next(response); // Actualiza el BehaviorSubject con los datos obtenidos
        return response;
      })
    );
  }

sustitucionesPendientesConsultas(data: { fechaFiltro: string }): Observable<SustitucionesPendientesResponse> {
  return this.http.post<SustitucionesPendientesResponse>(
    `${this.apiUrl}api/bcv/consultaSustitucionesPendientes`, data
  ).pipe(
    map((response: SustitucionesPendientesResponse) => {
      this.sustitucionesPendientesSource.next(response.sustituciones); // Solo el array para el BehaviorSubject
      return response;
    })
  );
}

exportarSustitucionesPendientes( data: { fechaFiltro: string }): Observable<HttpEvent<Blob>> {
  const req = new HttpRequest(
    'POST',
    `${this.apiUrl}api/bcv/consultaSustitucionesPendientes/exportar`, data,
    { responseType: 'blob',
      reportProgress: true,
     }
  );
  return this.http.request(req);
}


  
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

// #region Consulta de BCV
// Consulta de intervenciones del BCV
// 

consultaBCVIntervencion(data: { fechaFiltro: string }): Observable<any[]> {
  console.log("Data a enviar:", data);
  return this.http.post<any[]>(
    `${this.apiUrl}api/bcv/listarArchivos`,
    data
  );
}
exportarConstultaBcv(data: { fechaFiltro: string }): Observable<HttpEvent<Blob>> {
   const req = new HttpRequest(
    'POST',
 `${this.apiUrl}api/bcv/listarArchivos/exportar`, data,
    { responseType: 'blob',
      reportProgress: true,
     }
  );
  return this.http.request(req);
}

descargaArchivoBcv(data: { nuVenta: string }):Observable<HttpEvent<Blob>> {
  const req = new HttpRequest(
    'POST',
 `${this.apiUrl}api/bcv/listarOperaciones/exportar`, data,
    { responseType: 'blob',
      reportProgress: true,
     }
  );
  return this.http.request(req);
}


// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

// #region Sustituciones Pendientes 
// CONSULTAR SUSTITUCIONES DE OPERACIONES


consultarSustituciones(data: { fechaFiltro: string }): Observable<any[]> {
  console.log("Data a enviar:", data);
  return this.http.post<any[]>(
    `${this.apiUrl}api/bcv/consultaSustitucionesPendientes`,
    data
  );
}


// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

// #region Consulta definitiva BCV 
// CONSULTAR OPERACIONES POR INTERVENCION


exportarConsultaDefinitiva(data: { fechaFiltro: string }):Observable<HttpEvent<Blob>> {
  const req = new HttpRequest(
    'POST',
    `${this.apiUrl}api/bcv/consultarOperaciones/exportar`,
    data,
    { responseType: 'blob',
      reportProgress: true,
     }
  );
  return this.http.request(req);
}



// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

// #region Intencion Retiro
// 

consultaIntencionRetiro(data: { fechaDesde: string; fechaHasta: string }): Observable<IntencionRetiro[]> {
  console.log("Data a enviar:", data);
  return this.http.post<{ code: number; message: string; data: IntencionRetiro[] }>(
      `${this.apiUrl}api/rest/intencionretiro`,
      data
  ).pipe(
    map(response => {
      console.log("Respuesta del servicio:", response);
      return response.data; // Extrae solo el array de datos
    })
  );
}


exportarIntencionRetiro(data: { fechaDesde: string; fechaHasta: string }): Observable<HttpEvent<Blob>> {
  const req = new HttpRequest(
    'POST',
    `${this.apiUrl}api/rest/intencionretiro/exportar`,
    data,
    { responseType: 'blob',
      reportProgress: true,
     }
  );
  return this.http.request(req);
}
// #region Intencion Venta-Compra
// 
// 

consultaIntencionVenta(data: { fechaDesde: string; fechaHasta: string }): Observable<IntencionVenta[]> {
  console.log("Data a enviar Venta:", data);
  return this.http.post<{ code: number; message: string; data: IntencionVenta[] }>(
      `${this.apiUrl}api/rest/intencioncompra`,
      data
  ).pipe(
    map(response => {
      console.log("Respuesta del servicio Venta:", response);
      return response.data; // Extrae solo el array de datos
    })
  );
}


exportarIntencionVenta(data: { fechaDesde: string; fechaHasta: string }): Observable<HttpEvent<Blob>> {
  const req = new HttpRequest(
    'POST',
    `${this.apiUrl}api/rest/intencioncompra/exportar`,
    data,
    { responseType: 'blob',
      reportProgress: true,
     }
  );
  return this.http.request(req);
}

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

//#region oficinasComerciales

consultaOficinascomerciales(): Observable<any[]> {
  return this.http.get(`${this.apiUrl}api/bcv/oficinasComerciales`).pipe(
    map((response: any) => {
      console.log("Consulta de oficinas comerciales", response);
      return response;
    })
  )
}
// 








// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------

//#region cambioClaveIntervencion

cambioClaveIntervencion(data: { claveActual: string; claveNueva: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}api/bcv/cambiarClave`, data).pipe(
    map((response: any) => {
      console.log("Respuesta de cambio de clave de intervención", response);
      return response;
    })
  );
}
// 








// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------


//#region Tasas 
// 
// 
// Consulta de tasas de cambio


  consultarTasas(): Observable<{
    compraUsd: string, 
    compraEur: string, 
    compraPTR: string, 
    compraCNY: string, 
    compraTRY: string, 
    compraRUB: string,
    fechaValor: string
  }> {
    return this.http.get<any>(`${this.apiUrl}api/bcv/tasasCambio`).pipe (
      map(response => {
        const usd = response.monedas.find((m: any) => m.codigo === 'USD');
        const eur = response.monedas.find((m: any) => m.codigo === 'EUR');
        const ptr = response.monedas.find((m: any) => m.codigo === 'PTR');
        const cny = response.monedas.find((m: any) => m.codigo === 'CNY');
        const moneTry = response.monedas.find((m: any) => m.codigo === 'TRY');
        const rub = response.monedas.find((m: any) => m.codigo === 'RUB');
        const fechaValor = this.formatearFecha(response.fechaActualizacion);
        
        const tasas = {
          compraUsd: this.formatearNumero(usd.compra,4),
          compraEur: this.formatearNumero(eur.compra,4),
          compraPTR: this.formatearNumero(ptr.compra,4),
          compraCNY: this.formatearNumero(cny.compra,4),
          compraTRY: this.formatearNumero(moneTry.compra,4),
          compraRUB: this.formatearNumero(rub.compra,4),
          fechaValor           
        };

        this.tasasSource.next(tasas);

        return tasas;
      })
    );
  }


  // ---------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------


  // #region Funciones

  private formatearFecha(fecha: string): string {
    const [anio, mes, dia] = fecha.split('-'); // Divide la fecha en año, mes y día
    return `${dia}-${mes}-${anio}`; // Devuelve la fecha en el formato dd-MM-yyyy
  }


  private formatearNumero(valor: number, maxDecimales: number): string {
    const partes = valor.toString().split('.'); // Divide la parte entera y decimal
    if (partes.length === 1) {
        // Si no hay parte decimal, retorna el número como está
        return partes[0];
    }
    const decimales = partes[1].slice(0, maxDecimales); // Toma solo los decimales necesarios
    return `${partes[0]}.${decimales}`; // Combina la parte entera y los decimales truncados
}

  // ---------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------------------

  // #region Getter

  getMenu(): Observable<any> {
    return this.http.get(`${this.apiUrl}api/menu`);
  }
}
