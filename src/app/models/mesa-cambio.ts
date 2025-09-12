export interface respuestaPactoDireco{
    codigo: string,
    mensajeCliente: string,
    mensajeSistema: string,
    cantidad: string,
    totales: string,
    respActo: pactoDirecto[],
    jornadasList: []
}

export interface pactoDirecto {
    ID_OPER:              string,
    ID_OC:                string,
    PRODUCTO:             string,
    TIPO_NOTIFICACION:    string,
    TIPO_OPER:            string,
    MTO_DIVISAS:          string,
    MTO_BOLIVARES:        string,
    TASA_CAMBIO:          string,
    COD_FINSTITUCION:     string,
    MTO_COMI:             string,
    TIPO_PER_OFER:        string,
    CED_RIF_OFER:         string,
    NOM_OFER:             string,
    CTA_OFER_MN:          string,
    CTA_OFER_ME:          string,
    TIPO_INSTRUM:         string,
    TIPO_PER_DEMA:        string,
    CED_RIF_DEMA:         string,
    NOM_DEMA:             string,
    CTA_DEMA_MN:          string,
    CTA_DEMA_ME:          string,
    FECH_OPER:            string,
    COD_DIVISAS:          string,
    MTO_PACTOBASE:        string,
    MTO_CONTRAVALORBASE:  string,
    TASA_PACTOBASE:       string,
    TIPO_PACTO:           string,
    STATUS_ENVIO:         string,
    FECHA_ENVIO:          string,
    OBSERVACION :         string,
    ID_BCV:               string,
    ID_JORNADA:           string,
    HORA:                 string,
    MTO_CONTRAVALOR_USD:  string
}


export interface respuestaInterbancaria{
    codigo: string,
    mensajeCliente: string,
    mensajeSistema: string,
    cantidad: string,
    totales: string,
    respInter: Interbancaria[],
    jornadasList: []
}

export interface Interbancaria {
  ID: number;
  TIPO_OPER: string;
  RIF_CLIENTE: number;
  NOMBRE_CLIENTE: string;
  CODIGO_MONEDA: string;
  MONTO: number;
  TASA_CAMBIO: number;
  FECHA: string; // Usar string para TIMESTAMP, puede ajustarse a Date si se requiere
  CODIGO_INSTITUCION: string;
  ID_JORNADA: string;
  CUENTA_ME: string;
  CUENTA_MN: string;
  TIPO_INSTRUMENTO: string;
  OBSERVACION: string;
  ESTATUS: string;
  ID_BCV: string;
  TIPO_CLIENTE: string;
}
export interface Canje {
  ID: number;
  TIPO_OPER: string;
  TIPO_PER: string;
  RIF_CLIENTE: number;
  NOMBRE_CLIENTE: string;
  CODIGO_MONEDA_ENT: string;
  MONTO_ENT: number;
  TIPO_INSTRU_ENT: string;
  FECHA: string; // Puede ser Date si se requiere
  CUENTA_ME_ENT: string;
  CUENTA_MN_ENT: string;
  CODIGO_MONEDA_REC: string;
  MONTO_REC: number;
  TIPO_INSTRU_REC: string;
  CUENTA_ME_REC: string;
  CUENTA_MN_REC: string;
  MONTO_REC_BCV: number;
  MONTO_CANJE_BASE: number;
  TIPO_PACTO: string;
  OBSERVACION: string;
  ESTATUS: string;
  ID_JORNADA: string;
  ID_BCV: string;
}
