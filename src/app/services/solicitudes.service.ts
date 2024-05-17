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

  consultarServicio(tipoServicio : any, nivelCargo: any): Observable<any>{
    const url = this.urlEndPoint + 'servicio';
    const dataBusqueda = {
      idTipoServicio : tipoServicio,
      nivelCargo:nivelCargo
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


consultarMotivo(): Observable<any>{
  const url = this.urlEndPoint + 'consultarMotivos';
  return this.http.post(url, ''); 
}

consultarSolicitudesBuzonPendiente(area: any): Observable <any>{

  const url = this.urlEndPoint + 'consultarSolicitudesBuzonPendiente';
  const dataBusqueda = {
    area : area
  };
  return this.http.post(url, dataBusqueda);

}

consultarMetodosAutenticacion(): Observable<any>{
  const url = this.urlEndPoint + 'consultarMetodosAutenticacion';
  return this.http.post(url, ''); 
}

consultaSolicitudDetalle(idSolicitud: any): Observable <any>{

  const url = this.urlEndPoint + 'consultaSolicitudDetalle  ';
  const dataBusqueda = {
    idSolicitud : idSolicitud
  };
  return this.http.post(url, dataBusqueda);

}

asignarSolicitudes(idSolicitud: any, codigoUsuario: any): Observable <any>{

  const url = this.urlEndPoint + 'asignarSolicitudes';
  const dataBusqueda = {
    idSolicitud : idSolicitud,
    codigoUsuario: codigoUsuario,
  };
  return this.http.post(url, dataBusqueda);

}

obtenerSupervisoresJRQ(codUnidadJrq: any, nivel: any, codUsuario: any): Observable <any>{

  const url = this.urlEndPoint + 'peopleSoftWS/obtenerSupervisoresJRQ';
  const dataBusqueda = {
    codUnidadJrq : codUnidadJrq,
    nivel: nivel,
    codUsuario : codUsuario
  };
  return this.http.post(url, dataBusqueda);

}



ubicacionFisica(): Observable <any>{

  const url = this.urlEndPoint + 'int-servicios/ubicacionFisica';

  return this.http.post(url, '');

}



ubicacionFisicaDetalle(codUbicacion: any): Observable <any>{

  const url = this.urlEndPoint + 'int-servicios/ubicacionFisicaDetalle';
  const dataBusqueda = {
    codUbicacion : codUbicacion,
  };
  return this.http.post(url, dataBusqueda);

}


solicitudesAsignadasFlujo(codUsuario: any): Observable <any>{

  const url = this.urlEndPoint + 'solicitudesAsignadasFlujo';
  const dataBusqueda = {
    codUsuario : codUsuario
  };
  return this.http.post(url, dataBusqueda);

}



consultarTipoEquipo(): Observable <any>{

  const url = this.urlEndPoint + 'saitWS/consultarTipoEquipo';

  return this.http.post(url, '');

}



consultarSerialesDisponibles(): Observable <any>{

  const url = this.urlEndPoint + 'saitWS/consultarSerialesDisponibles';

  return this.http.post(url, '');

}

consultarMarcaEquipo(idTipoEquipo: any): Observable <any>{

  const url = this.urlEndPoint + 'saitWS/consultarMarcaEquipo';
  const dataBusqueda = {
    idTipoEquipo : idTipoEquipo,
  };
  return this.http.post(url, dataBusqueda);

}
conusltarMarcaXmodelo(idTipoEquipo: any, idMarca : any): Observable <any>{

  const url = this.urlEndPoint + 'saitWS/conusltarMarcaXmodelo';
  const dataBusqueda = {
    idTipoEquipo : idTipoEquipo,
    idMarca : idMarca
  };
  return this.http.post(url, dataBusqueda);

}
consultarEquiposXserial(serial: any): Observable <any>{

  const url = this.urlEndPoint + 'saitWS/consultarEquiposXserial';
  const dataBusqueda = {
    serial : serial,
  };
  return this.http.post(url, dataBusqueda);

}


conusltarSerialXTipoEquipo(idTipoEquipo: any): Observable <any>{

  const url = this.urlEndPoint + 'saitWS/conusltarSerialXTipoEquipo';
  const dataBusqueda = {
    idTipoEquipo : idTipoEquipo,
  };
  return this.http.post(url, dataBusqueda);

}



consultarSolicitudReasignar(tarea: any): Observable <any>{

  const url = this.urlEndPoint + 'consultarSolicitudReasignar';
  const dataBusqueda = {
    tarea : tarea
  };
  return this.http.post(url, dataBusqueda);

}

reasignarSolicitud(idSolicitud : any, codigoUsuario: any): Observable<any>{
  const url = this.urlEndPoint + 'reasignarSolicitud';
  const dataBusqueda = {
    idSolicitud : idSolicitud,
    codigoUsuario: codigoUsuario
  };
  return this.http.post(url, dataBusqueda);
}

consultarEquipoPorUsuario(codUsuario: any): Observable <any>{

  const url = this.urlEndPoint + 'saitWS/consultarEquipoPorUsuario';
  const dataBusqueda = {
    codigoUsuario : codUsuario
  };
  return this.http.post(url, dataBusqueda);

}

consultarEstadisticaSolicitud(codUsuario: any): Observable <any>{

  const url = this.urlEndPoint + 'consultarEstadisticaSolicitud';
  const dataBusqueda = {
    codUsuario : codUsuario
  };
  return this.http.post(url, dataBusqueda);

}

consultarSolicitudHistorico(codUsuario: any): Observable <any>{

  const url = this.urlEndPoint + 'consultarSolicitudHistorico';
  const dataBusqueda = {
    codUsuario : codUsuario
  };
  return this.http.post(url, dataBusqueda);

}


generarToken(codUsuario: any, notificacion: any): Observable <any>{

  const url = this.urlEndPoint + 'int-servicios/generarToken';
  const dataBusqueda = {
    codigoUsuario : codUsuario,
    notificacion: notificacion
  };
  return this.http.post(url, dataBusqueda);

}


certificarToken(codUsuario: any, token: any): Observable <any>{

  const url = this.urlEndPoint + 'int-servicios/certificarToken';
  const dataBusqueda = {

    token: token,
    codigoUsuario : codUsuario
  };
  return this.http.post(url, dataBusqueda);

}

estatus(): Observable <any>{

  const url = this.urlEndPoint + 'estatus';

  return this.http.post(url, '');

}



reporteTecServCons(idCategoriaFk : any, idTipoServicioFk: any): Observable<any>{
  const url = this.urlEndPoint + 'reporteTecServCons';
  const dataBusqueda = {
    idCategoriaFk : idCategoriaFk,
    idTipoServicioFk:idTipoServicioFk
  };
  return this.http.post(url, dataBusqueda);
}


reporteTecServ(fechaInicio : any, fechaFin: any, estatus : any): Observable<any>{
  const url = this.urlEndPoint + 'reporteTecServ';
  const httpOptions = {
    responseType: 'blob' as 'json'
  };
  const dataBusqueda = {
    fechaInicio : fechaInicio,
    fechaFin:fechaFin,
    estatus : estatus
  };

  console.log(dataBusqueda);
  return this.http.post(url, dataBusqueda, httpOptions);
}

}
