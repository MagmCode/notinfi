import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ServiceService } from 'app/services/service.service';
import { HttpEventType } from '@angular/common/http';


/**
 * Componente para la consulta definitiva BCV de jornadas de intervención.
 * Permite al usuario ingresar el código de jornada y exportar la información asociada.
 * Incluye validación de formulario y navegación al menú principal.
 */
@Component({
  selector: 'app-consulta-definitiva-bcv',
  templateUrl: './consulta-definitiva-bcv.component.html',
  styleUrls: ['./consulta-definitiva-bcv.component.scss']
})
export class ConsultaDefinitivaBcvComponent implements OnInit {

  /** Formulario reactivo para la consulta */
  consultaForm: FormGroup;
/** Variable para almacenar el archivo exportado */
  exportProgress = 0;
  /** Variable para controlar la visibilidad del progreso de exportación */
showExportProgress = false;

  /**
   * Constructor del componente.
   * @param _formBuilder Servicio para construir formularios reactivos.
   * @param _router Servicio de rutas de Angular.
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _service: ServiceService
  ) {}

  /**
   * Inicializa el formulario reactivo con validación requerida para el código de jornada.
   */
  ngOnInit(): void {
    this.consultaForm = this._formBuilder.group({
      cod: ['', Validators.required]
    });
  }

  /**
   * Lógica para exportar la jornada.
   * (Implementar según los requerimientos del sistema)
   */
//   exportarJornada(): void {
//     if (this.consultaForm.invalid) {
//       return;
//     }

//     this.exportProgress = 0;
//     this.showExportProgress = true;

//     const steps = 14;
//       const progressSub: Subscription = interval(100).pipe(take(steps + 1)).subscribe(i => {
//     this.exportProgress = Math.round((i / steps) * 100);
//   });

//   const codigoJornada = this.consultaForm.value.cod;
//   this._service.exportarConsultaDefinitiva({fechaFiltro: codigoJornada}).subscribe ({
//     next: (data) => {
//       const datos = (data || []).map(row => ({
//         'Código Cliente': row.codigoCliente,
//         'Nombre Cliente': row.nombreCliente,
//         'Fecha Valor': row.fechaValor,
//         'Tipo Operación': row.codigoTipoOperacion,
//         'Monto Divisa': row.montoDivisa,
//         'Tipo Cambio': row.tipoCambio,
//         'Cuenta Divisa': row.codigoCuentaDivisa,
//         'Cuenta Bs': row.codigoCuentaBs,
//         'ISO Divisa': row.codigoIsoDivisa,
//         'Código Venta BCV': row.codigoVentaBCV
//     }));
//     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
//       const workbook: XLSX.WorkBook = { Sheets: { 'ConsultaDefinitiva': worksheet }, SheetNames: ['ConsultaDefinitiva'] };
//       const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//       const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

//       setTimeout(() => {
//         saveAs(blob, `ConsultaDefinitiva_${codigoJornada}.xlsx`);
//         this.showExportProgress = false;
//         progressSub.unsubscribe();
//       }, 1500); // Espera un poco para que el progress bar llegue a 100%
//     },
//     error: (err) => {
//       this.showExportProgress = false;
//       progressSub.unsubscribe();
//       // Muestra mensaje de error si lo deseas
//     }
//   });
// }

exportarJornada(): void {
  if (this.consultaForm.invalid) {
    return;
  }

  this.exportProgress = 0;
  this.showExportProgress = true;

  const codigoJornada = this.consultaForm.value.cod;
  this._service.exportarConsultaDefinitiva({ fechaFiltro: codigoJornada }).subscribe({
    next: (event) => {
      if (event.type === HttpEventType.DownloadProgress) {
        if (event.total) {
          this.exportProgress = Math.round(100 * event.loaded / event.total);
        }
      } else if (event.type === HttpEventType.Response) {
        let fileName = `ConsultaDefinitiva_${codigoJornada}.xls`; // Valor por defecto
        const contentDisposition = event.headers?.get('Content-Disposition');
        if (contentDisposition) {
          const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
          if (matches && matches[1]) {
            fileName = matches[1];
          }
        }
        this.exportProgress = 100;
        this.showExportProgress = false;
        this.descargarArchivo(event.body as Blob, fileName);
        // Opcional: notificación
        // this._snackBar.open('Archivo listo. La descarga comenzará en breve.', 'Cerrar', { duration: 4000 });
      }
    },
    error: (err) => {
      this.showExportProgress = false;
      // Opcional: notificación de error
      // this._snackBar.open('Error al exportar el archivo.', 'Cerrar', { duration: 4000 });
      console.error('Error al exportar:', err);
    }
  });
}

private descargarArchivo(blob: Blob, nombre: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  window.URL.revokeObjectURL(url);
}


  /**
   * Navega al menú principal de la aplicación.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/']);
  }
}