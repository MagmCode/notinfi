export interface IntencionRetiro {
    rif: string;
    nombreEmpresa: string;
    moneda: string;
    montoDivisa: string;
    numeroCuentaOrigen: string;
    porcentajeComision: string;
    montoComision: string;
    agencia: string;
    estatus: string;
    fechaHoraOperacion: string;
    nacionalidad: string;
    documento: string;
}

export interface TableFilter {
    text: string;
    estatus: string;
}

export interface BusquedaCriterios {
    fechaDesde: string;
    fechaHasta: string;
    nacionalidad?: string;
    documento?: string;
    agencia?: string;
    estatus?: string;
}