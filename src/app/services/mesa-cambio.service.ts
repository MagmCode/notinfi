import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class MesaCambioService {

  private apiUrl = environment.urlEndPoint; // Asegúrate de importar 'environment' desde el archivo correcto

  constructor(
    private http: HttpClient
  ) { }

  // #region Consultas

  // --------------------------------------------------------------------------------------------Pacto Directo ----------------- 

  // -------------------------------------------------------------------------------------------------------------

}
