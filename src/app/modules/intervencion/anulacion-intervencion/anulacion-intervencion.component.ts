import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ExportProgressService } from 'app/services/export-progress.service';
import { ServiceService } from 'app/services/service.service';

@Component({
  selector: 'anulacion-intervencion',
  templateUrl: './anulacion-intervencion.component.html',
  styleUrls: ['./anulacion-intervencion.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class AnulacionIntervencionComponent implements OnInit {
 //#region Variables

  /** Formulario reactivo para la carga de archivos */
  anulacionForm: FormGroup;

  /** Nombre del archivo seleccionado */
  fileName = '';

  /** Mensaje de error para la carga de archivos */
  fileError = '';

  /** Extensiones de archivo permitidas para la carga */
  private allowedExtensions = ['xls', 'xlsx', 'xlsm', 'xlsb', 'xlt', 'xltx', 'xltm'];

  //#endregion

  /**
   * Constructor del componente.
   * @param _formBuilder Servicio para construir formularios reactivos.
   * @param _router Servicio de rutas de Angular.
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    public exportProgressService: ExportProgressService,
    private _service: ServiceService,
    private _snackBar: MatSnackBar
  ) {}

  /**
   * Inicializa el formulario de carga al iniciar el componente.
   */
  ngOnInit(): void {
    this.anulacionForm = this._formBuilder.group({
      file: ['', Validators.required]
    });
  }

  /**
   * Maneja el evento de selección de archivo.
   * Valida la extensión y actualiza el formulario.
   * @param event Evento de selección de archivo.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      if (this.allowedExtensions.includes(fileExtension)) {
        this.fileName = file.name;
        this.anulacionForm.controls['file'].setValue(file);
        this.fileError = '';
      } else {
        this.resetFile('Por favor, sube un archivo Excel válido', { invalidFile: true });
      }
    } else {
      if (!this.anulacionForm.controls['file'].value) {
        this.resetFile('Archivo inválido. Debe ser un archivo Excel', { required: true });
      }
    }
  }

  /**
   * Resetea el campo de archivo y muestra un mensaje de error.
   * @param errorMsg Mensaje de error a mostrar.
   * @param errorObj Objeto de error para el control del formulario.
   */
  private resetFile(errorMsg: string, errorObj: any): void {
    this.fileName = '';
    this.fileError = errorMsg;
    this.anulacionForm.controls['file'].setErrors(errorObj);
  }

  /**
   * Navega a la página de éxito si el formulario es válido.
   */
  loadFile(): void {
    if (this.anulacionForm.invalid) {
      return;
    }
    this._router.navigate(['success']);
  }

  /**
   * Procesa el archivo cargado.
   * Aquí se debe implementar la lógica de procesamiento.
   */
procesar() {
  const file: File = this.anulacionForm.get('file')?.value;
  console.log('[procesar] Archivo seleccionado:', file);

  if (!file) {
    this._snackBar.open('Debe seleccionar un archivo para procesar.', 'Cerrar', { duration: 3000 });
    console.warn('[procesar] No se seleccionó archivo.');
    return;
  }

  this._service.anularOperaciones(file).subscribe({
    next: (resp) => {
      console.log('[procesar] Respuesta del backend:', resp);
      this._snackBar.open('Archivo enviado correctamente.', 'Cerrar', { duration: 4000 });
      // Aquí puedes limpiar el formulario o actualizar la vista
    },
    error: (err) => {
      console.error('[procesar] Error al enviar el archivo:', err);
      this._snackBar.open('Error al enviar el archivo.', 'Cerrar', { duration: 4000 });
    }
  });
}
descargarPlantilla() {
  this._service.planillaAnulacionIntervencion().subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Plantilla_Anulacion_INTERVENCION.xls';
      a.click();
      window.URL.revokeObjectURL(url);
      this._snackBar.open('Archivo listo. La descarga comenzará en breve.', 'Cerrar', { duration: 4000 });
    },
    error: () => {
      this._snackBar.open('No se pudo descargar la plantilla. Intente más tarde.', 'Cerrar', { duration: 4000 });
    }
  });
}


  /**
   * Navega al menú principal.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/']);
  }
}