import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { WebSocketService } from './websocket.service';

@Injectable({ providedIn: 'root' })
export class ExportProgressService {
  exportProgress$ = new BehaviorSubject<number>(0);
  showExportProgress$ = new BehaviorSubject<boolean>(false);
  showExportStart$ = new BehaviorSubject<boolean>(false);
  generandoArchivo$ = new BehaviorSubject<boolean>(false);
  mensajePreparandoDescarga$ = new BehaviorSubject<string>('Preparando archivo para la descarga...');
  mensajeConexionActual$ = new BehaviorSubject<string>('Estableciendo conexión...');

  private mensajeDescarga = [
    'Preparando archivo para la descarga...',
    'Espere, por favor...',
    'Ya casi está listo...'
  ];
  private mensajeConexion = [
    'Estableciendo conexión...',
    'Espere un momento, por favor...'
  ];

  private intervaloMensajeDescarga: any = null;
  private intervaloMensajeConexion: any = null;
  private wsSubscription: Subscription;

  // Callbacks para cada exportación
  private descargarArchivoCb: ((blob: Blob, fileName: string) => void) | null = null;
  private exportarCb: (() => any) | null = null;

  // Flag para evitar múltiples descargas por varios mensajes 'complete'
  private exportacionEnCurso = false;

  constructor(private ws: WebSocketService) {
    // Suscríbete UNA SOLA VEZ al WebSocket
    this.wsSubscription = this.ws.progress$.subscribe(data => {
      this.handleWebSocketData(data);
    });
  }

  iniciarProgreso(
    descargarArchivoCb: (blob: Blob, fileName: string) => void,
    exportarCb: () => any
  ) {
    console.log('[ExportProgressService] iniciarProgreso');
    this.exportacionEnCurso = true;
    this.descargarArchivoCb = descargarArchivoCb;
    this.exportarCb = exportarCb;

    this.exportProgress$.next(0);
    this.showExportStart$.next(true);
    this.showExportProgress$.next(false);
    this.generandoArchivo$.next(false);
    this.iniciarIntervaloConexion();

    // Inicia el proceso de exportación (esto dispara el proceso en el backend)
    this.exportarCb().subscribe({
      error: () => {
        console.log('[ExportProgressService] Error en exportarCb');
        this.showExportProgress$.next(false);
        this.showExportStart$.next(false);
        this.generandoArchivo$.next(false);
        this.limpiarIntervaloConexion();
        this.limpiarIntervaloDescarga();
        this.exportacionEnCurso = false;
      }
    });
  }

  private handleWebSocketData(data: any) {
    if (!data) return;

    console.log('[ExportProgressService] WebSocket data:', data);

    if (data.status === 'progress') {
      console.log('[ExportProgressService] status: progress', data.progress);
      this.showExportStart$.next(false);
      this.showExportProgress$.next(true);
      this.exportProgress$.next(data.progress);
      this.limpiarIntervaloConexion();
    }

    if (
      data.status === 'complete' &&
      data.fileName &&
      this.showExportProgress$.value &&
      !this.generandoArchivo$.value &&
      this.exportarCb &&
      this.descargarArchivoCb
    ) {
      console.log('[ExportProgressService] status: complete', data);

      if (!this.exportacionEnCurso) {
        console.log('[ExportProgressService] Ignorando mensaje complete duplicado');
        return;
      }
      this.exportacionEnCurso = false;
      this.generandoArchivo$.next(true);

      // Lleva la barra al 100% inmediatamente
      this.exportProgress$.next(100);

      this.iniciarIntervaloDescarga();

      this.exportarCb().subscribe({
        next: (event: any) => {
          if (event.type === 4) {
            let fileName = data.fileName;
            if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
              fileName += '.xlsx';
            }
            console.log('[ExportProgressService] Descargando archivo:', fileName);
            this.descargarArchivoCb!(event.body as Blob, fileName);

            // Oculta la barra y mensajes después de un pequeño delay (opcional)
            setTimeout(() => {
              this.exportProgress$.next(100);
              this.showExportProgress$.next(false);
              this.generandoArchivo$.next(false);
              this.limpiarIntervaloDescarga();
              console.log('[ExportProgressService] Descarga finalizada');
            }, 500);
          }
        },
        error: () => {
          this.showExportProgress$.next(false);
          this.generandoArchivo$.next(false);
          this.limpiarIntervaloDescarga();
          console.log('[ExportProgressService] Error en descarga');
        }
      });
    }
  }

  // Métodos auxiliares para los intervalos

  public descargarArchivo(blob: Blob, nombre: string): void {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  window.URL.revokeObjectURL(url);
}

  private iniciarIntervaloConexion() {
    this.mensajeConexionActual$.next(this.mensajeConexion[0]);
    let index = 0;
    this.limpiarIntervaloConexion();
    this.intervaloMensajeConexion = setInterval(() => {
      index = (index + 1) % this.mensajeConexion.length;
      this.mensajeConexionActual$.next(this.mensajeConexion[index]);
      console.log('[ExportProgressService] Mensaje conexión:', this.mensajeConexion[index]);
    }, 5000);
  }
  private limpiarIntervaloConexion() {
    if (this.intervaloMensajeConexion) {
      clearInterval(this.intervaloMensajeConexion);
      this.intervaloMensajeConexion = null;
    }
  }
  private iniciarIntervaloDescarga() {
    this.mensajePreparandoDescarga$.next(this.mensajeDescarga[0]);
    let index = 0;
    this.limpiarIntervaloDescarga();
    this.intervaloMensajeDescarga = setInterval(() => {
      index = (index + 1) % this.mensajeDescarga.length;
      this.mensajePreparandoDescarga$.next(this.mensajeDescarga[index]);
      console.log('[ExportProgressService] Mensaje descarga:', this.mensajeDescarga[index]);
    }, 5000);
  }
  private limpiarIntervaloDescarga() {
    if (this.intervaloMensajeDescarga) {
      clearInterval(this.intervaloMensajeDescarga);
      this.intervaloMensajeDescarga = null;
    }
  }
  limpiar() {
    this.limpiarIntervaloConexion();
    this.limpiarIntervaloDescarga();
    this.exportacionEnCurso = false;
    console.log('[ExportProgressService] Limpieza completa');
  }
}