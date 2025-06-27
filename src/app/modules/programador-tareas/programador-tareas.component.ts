import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-programador-tareas',
  templateUrl: './programador-tareas.component.html',
  styleUrls: ['./programador-tareas.component.scss']
})
export class ProgramadorTareasComponent implements OnInit {

sistemas = [
  { nombre: 'OPICS', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'SWIFT', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'ALTAR', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'LIQUIDACION', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'ADJ_SUBASTA', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'ADJ_SITME', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'LIQ_SITME', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'LIQ_SUBASTA', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'INTERFACE_BCV', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'INTERFACE_CARMEN', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'INTERFACE_ESTADISTICA', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'ABONO_CTA_USD', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'TABLAS_CORPORATIVAS', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'ABONO_USD_VENTAS', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'ABONO_USD_CUPONES', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'CANCELACION_RECONSIDERACION', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'CIERRE_SISTEMA', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'INTERFACE_IBS', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'INTERFACE_CONTABILIDAD', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'INGRESAR_CUSTODIA', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'CONC_RETENCION', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'ENVIO_OP_DICOM', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'RECEP_OP_DICOM', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'ENVIO_OP_INTERVENCION', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'LECTURA_TASA_BCV', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'LECTURA_INTERVENCION', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'MESA_CAMBIO', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'ENVIO_OP_MENUDEO', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'CONCILIACION_MENUDEO_BCV', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'ENVIO_OPS_MONEDA_LOCAL', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'ENVIO_OPS_MONEDA_EXTRANJERA', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'OFICINAS_INTERVENCION', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'INVENTARIO_INTERVENCION', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'LECTURA_COE', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'PROCESO_MIGRACION_HISTORICO', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'PROCESO_ENVIO_AT48', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'PROCESO_LECTURA_COE', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true },
  { nombre: 'PROCESO_ENVIO_AT47', dia: '', hora: '', minuto: '', horaDesde: '', horaHasta: '', cadaMin: '', activo: true }
];

diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
horas = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
minutos = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
cadaMin = Array.from({ length: 59 }, (_, i) => (i + 1).toString().padStart(2, '0'));


displayedColumns: string[] = [
  'sistema', 'diaLabel', 'dia', 'horaLabel', 'hora', 'minutoLabel', 'minuto'
];

  constructor() { }

pageIndex = 0;
  pageSize = 5;
  sistemasPaginados = [];

  ngOnInit() {
    this.updatePaginados();
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginados();
  }

  updatePaginados() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.sistemasPaginados = this.sistemas.slice(start, end);
  }
}
