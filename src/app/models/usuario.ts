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
    servicio: String,
    responsable: String,
    codigoUsuarioResp: String,
    cedulaResp: String,
    nombresResp: String,
    codUnidadResp:String,
    unidadResp: String,
    idTarea: number,
    tarea: String,
    codusuarioGestion: any,
    nombreUsuarioGestion: any, 
    decision:String,   
    idCategoria:   number,
    categoria: String,
    idTipoServicio: number,
    tipoServicio: String ,
    metodo : any,
    detalle:any,
    formulario : any

  }


  export interface trancking{

    idSeguimiento: number,
    idSolicitud:number,
    idTarea : number,
    nombreTarea: String,
    codUsuarioInicio : String,
    nombreUsuarioInicio: String,
    fechaInicio: String,
    codUsuarioFin: String,
    nombreUsuarioFin: String,
    fechaFin: String,
    idDecision: String,
    decision: String,
    observacion: String,
    idMotivo : number,
    motivo: String
   
  }
  export interface equipoDto{
    idEquipo: number,
    serial:String,
    bienNacional: String,
    idTipoEquipo: number,
    tipoEquipo: String,
    idMarca:number ,
    marca:String,
    idModelo: number,
    modelo: String,
    relacion : number,
    evento:any
  }

  export interface tipoEquipo{
  
    idTipoEquipo: number,
    tipoEquipo: String,
  }