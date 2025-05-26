export interface respuestaIntervencion{
    codigo: number,
    mensajeCliente: string,
    mensajeSistema: string,
    cantidad: string,
    totales: string,
    respIntervencion: intervencion[],
    jornadasList: []
}

export interface intervencion{
    idOper :string;
    idOC :string;
    operacion :string;
    estatusOper :string;
    mtoDivisas :string;
    mtoBolivares :string;
    tasaCambio :string;
    mtoComision :string;
    mtoDivisastrans :string;
    nacionalidad :string;
    nroCedRif :string;
   nomCliente :string;
   ctaCliente :string;
   fechOper :string;
   conEstadistico :string;
   codOfiOri :string;
   codDivisas :string;
   emailCliente :string;
   telCliente :string;
   estatus :string;
   idJornada :string;
   ctaClienteDivisas :string;
}

// consulta Jornada intervencion
export interface jornadaActiva{
    coVentaBCV: number; 
    fechaInicio: string; 
    fechaFin: string; 
    codigoIsoDivisa: {
        coMonedaIso: string; 
    };
    tipoCambioIntervencion: [ 
        {
            fechaValor?: string;
            tipoCambio: number; 
        }
    ];
    numeroIntervencion: number; 
    tipoIntervencion: {
        nombreTipoIntervencion: string;
    };
    saldoDisponible: number;
}