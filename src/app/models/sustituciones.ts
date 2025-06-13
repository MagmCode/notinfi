export interface SustitucionesPendientesResponse {
  mensaje: string;
  cantidad: number;
  sustituciones: SustitucionPendiente[];
}

export interface SustitucionPendiente {
  coMovIntervencion: string;
  nuVenta: string | null;
  codigoCliente: string;
  nombreCliente: string;
  fechaValor: string;
  codigoTipoOperacion: string;
  montoDivisa: number;
  tipoCambio: number;
  codigoCuentaDivisa: string;
  codigoCuentaBs: string;
  codigoIsoDivisa: number;
  codigoVentaBCV: string;
}
