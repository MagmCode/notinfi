export interface usuario {
  
    codUsuario: string,
    cedula : string,
    nombres : string,
    codUnidad : string,
    unidad : string
    codCargo : string,
    cargo : string
  }


  export interface solicitudesDto{

    idSolicitud: number,
    codigoUsuario: String,
    cedula: String,
    nombres: String,
    codUnidad:String,
    unidad: String,
    codUnidadOrg: String,
    unidadOrg: String,
    codUnidadJrq: String,
    unidadJrq: String,
    ubicacionFisica: String,
    fechaCreacion: String,
    fechaModificacion: String,
    estatus:String,
    idServicio: number,
    responsable: String,
    codigoUsuarioResp: String,
    cedulaResp: String,
    nombresResp: String,
    codUnidadResp:String,
    unidadResp: String,
    idTarea: number,
    tarea: String
    codusuarioGestion: String,
    decision:String

  }