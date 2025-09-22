import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MesaCambioService {

  private apiUrl = environment.urlEndPoint; // Asegúrate de importar 'environment' desde el archivo correcto

  constructor(
    private http: HttpClient
  ) { }

  // #region Consultas

  // ------------------------------------------------------------------------------------------------------------- 
/**
 * Método genérico para realizar consultas POST a cualquier endpoint.
 * @param endpoint Endpoint relativo (ejemplo: 'api/mesa-cambio/pacto-directo/consulta')
 * @param filtros Objeto con los filtros del formulario.
 * @returns Observable con la respuesta del backend.
 */
  consultasMesaCambio<T>(endpoint: string, filtros: any): Observable<T> {
    return this.http.post<T>(
      `${this.apiUrl}${endpoint}`,
      filtros
    );
  }

    // ------------------------------------------------------------------------------------------------------------- 
/**
 * Método genérico para realizar consultas GET a cualquier endpoint.
 * @param endpoint Endpoint relativo (ejemplo: 'api/mesa-cambio/pacto-directo/consulta')
 * @param filtros Objeto con los filtros del formulario.
 * @returns Observable con la respuesta del backend.
 */
  consultarMesaCambio<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(
      `${this.apiUrl}${endpoint}`
    );
  }

  // -------------------------------------------------------------------------------------------------------------

  /**
 * Método genérico para editar POST a cualquier endpoint.
 * @param endpoint Endpoint relativo (ejemplo: 'api/mesa-cambio/pacto-directo/editar')
 * @param parametros Objeto con los parametros del formulario a editar.
 * @returns Observable con la respuesta del backend.
 */
 
  editarMesaCambio<T>(endpoint: string, parametros: any): Observable<T> {
  return this.http.post<T>(
    `${this.apiUrl}${endpoint}`,
    parametros
  );
}

  // -------------------------------------------------------------------------------------------------------------

  /**
 * Método genérico para registrar Operaciones de tipos POST a cualquier endpoint.
 * @param endpoint Endpoint relativo (ejemplo: 'api/mesa-cambio/pacto-directo/registrar')
 * @param parametros Objeto con los parametros a registrar del formulario a .
 * @returns Observable con la respuesta del backend.
 */
 
  registrarOperacion<T>(endpoint: string, parametros: any): Observable<T> {
  return this.http.post<T>(
    `${this.apiUrl}${endpoint}`,
    parametros
  );
}

  // -------------------------------------------------------------------------------------------------------------
/**
 * Método genérico para exportar archivos (descarga de Blob) vía POST.
 * @param endpoint Endpoint relativo (ejemplo: 'api/rest/intencioncompra/exportar')
 * @param data Objeto con los parámetros de exportación.
 * @returns Observable<HttpEvent<Blob>> para manejar el progreso y la descarga.
 */
exportarArchivoMesaCambio(endpoint: string, data: any): Observable<HttpEvent<Blob>> {
  const req = new HttpRequest(
    'POST',
    `${this.apiUrl}${endpoint}`,
    data,
    {
      responseType: 'blob',
      reportProgress: true
    }
  );
  return this.http.request(req);
} 

}
