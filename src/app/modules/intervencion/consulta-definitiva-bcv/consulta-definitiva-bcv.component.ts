import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ServiceService } from 'app/services/service.service';
import { HttpEventType } from '@angular/common/http';
import { WebSocketService } from 'app/services/websocket.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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
showExportStart = false;

private wsSubscription: Subscription;
generandoArchivo = false;

mensajeDescarga: string[] = [
  'Preparando archivo para la descarga...',
  'Espere, por favor...',
  'Ya casi está listo...'
];
mensajePreparandoDescarga = this.mensajeDescarga[0];
intervaloMensajeDescarga: any = null;
mensajeDescargaIndex = 0;

mensajeConexion: string[] = [
  'Estableciendo conexión...',
  'Espere un momento, por favor...'
]

mensajeConexionActual = this.mensajeConexion[0];
intervaloMensajeConexion: any = null;
mensajeConexionIndex = 0;

  /**
   * Constructor del componente.
   * @param _formBuilder Servicio para construir formularios reactivos.
   * @param _router Servicio de rutas de Angular.
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _service: ServiceService,
    private websocketService: WebSocketService,
    private _snackBar: MatSnackBar

  ) {}

  /**
   * Inicializa el formulario reactivo con validación requerida para el código de jornada.
   */
ngOnInit(): void {
  this.consultaForm = this._formBuilder.group({
    cod: ['', Validators.required]
  });


  // Suscripción al WebSocket para progreso de exportación
  if (this.wsSubscription) {
    this.wsSubscription.unsubscribe();
  }
  this.wsSubscription = this.websocketService.progress$.subscribe(data => {
    if (!data) return;

    if ((data.status === 'progress')) {
      this.showExportStart = false;
      this.showExportProgress = true;
      this.exportProgress = data.progress;
        if (this.intervaloMensajeConexion) {
        clearInterval(this.intervaloMensajeConexion);
      }
    }

    // Cuando el backend notifica que el archivo está listo
    if (
      data.status === 'complete' &&
      data.fileName &&
      this.showExportProgress &&
      !this.generandoArchivo
    ) {
      this.exportProgress = 0;
      this.generandoArchivo = true;

      // Inicia el ciclo de mensajes alternantes
      this.mensajeDescargaIndex = 0;
      this.mensajePreparandoDescarga = this.mensajeDescarga[0];
      this.intervaloMensajeDescarga = setInterval(() => {
        this.mensajeDescargaIndex = (this.mensajeDescargaIndex + 1) % this.mensajeDescarga.length;
        this.mensajePreparandoDescarga = this.mensajeDescarga[this.mensajeDescargaIndex];
      }, 5000);

         // Avanza la barra manualmente mientras se descarga
    const intervaloBarra = setInterval(() => {
      if (this.exportProgress < 95) {
        this.exportProgress += 5;
      }
    }, 300);

      const codigoJornada = this.consultaForm.value.cod;
      this._service.exportarConsultaDefinitiva({ fechaFiltro: codigoJornada }).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.Response) {
            let fileName = data.fileName;
            if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
              fileName += '.xlsx';
            }
            this.descargarArchivo(event.body as Blob, fileName);
            this._snackBar.open('Archivo listo. La descarga comenzará en breve.', 'Cerrar', { duration: 4000 });
            this.showExportProgress = false;
            this.generandoArchivo = false;
            if (this.intervaloMensajeDescarga) {
              clearInterval(this.intervaloMensajeDescarga);
            }
          }
        },
        error: () => {
          this.showExportProgress = false;
          this.generandoArchivo = false;
          if (this.intervaloMensajeDescarga) {
            clearInterval(this.intervaloMensajeDescarga);
          }
          clearInterval(intervaloBarra)
        }
      });
    }
  });
}

ngOnDestroy(): void {
  if (this.wsSubscription) {
    this.wsSubscription.unsubscribe();
  }
}

  /**
   * Lógica para exportar la jornada.
   */


exportarJornada(): void {
  if (this.consultaForm.invalid) {
    return;
  }
  this.exportProgress = 0;
  this.showExportStart = true;
  this.generandoArchivo = false;

  // Inicia el ciclo de mensajes de conexión
  this.mensajeConexionIndex = 0;
  this.mensajeConexionActual = this.mensajeConexion[0];
  this.intervaloMensajeConexion = setInterval(() => {
    this.mensajeConexionIndex = (this.mensajeConexionIndex + 1) % this.mensajeConexion.length;
    this.mensajeConexionActual = this.mensajeConexion[this.mensajeConexionIndex];
  }, 5000);


  const codigoJornada = this.consultaForm.value.cod;
  this._service.exportarConsultaDefinitiva({ fechaFiltro: codigoJornada }).subscribe({
    error: (err) => {
      this.showExportProgress = false;
      this.showExportStart = false;
      if(this.intervaloMensajeConexion) {
        clearInterval(this.intervaloMensajeConexion)
      }
      this._snackBar.open('Error al exportar el archivo.', 'Cerrar', { duration: 4000 });
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