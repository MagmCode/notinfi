export interface login{
    codUsuario : string,
    clave: string
}

export interface loginLdap{
    status: string,
    mensaje: string,
    usuario: IusuarioLdap
}

export interface IusuarioLdap{
    codigo: string,
    nacionalidad: string,
    cedula: string,
    nombres: string,
    apellidos: string,
    codigoCargo: string,
    descCargo: string,
    nivelCargo: string,
    correo: string,
    estatus: string,
    grupoPago: string,
    codUnidad: string,
    descUnidad: string,
    codEmpresa: string,
    descEmpresa: string,
    nombresSupervisor: string,
    apellidosSupervisor: string,
    codigoSupervisor: string,
    correoSupervisor: string,
    codUnidadSupervisor: string
}

export interface usuarioMenu  {
    id    : string,
    name  : string,
    email : string,
    avatar: 'assets/images/avatars/brian-hughes.jpg',
    status: string
}


export interface ISelect{
    id: string;
    name: string;
}

export interface ISelectEquipo{
   
    idTipoEquipo: string;
    tipoEquipo: string;
}