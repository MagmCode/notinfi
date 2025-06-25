//#region Imports
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ServiceService } from 'app/services/service.service';
//#endregion

/**
 * Componente para la carga y procesamiento de archivos de Sustitución de Operaciones.
 * Permite seleccionar un archivo Excel, valida su extensión y gestiona el formulario de carga.
 */
@Component({
  selector: 'app-sustitucion-operaciones',
  templateUrl: './sustitucion-operaciones.component.html',
  styleUrls: ['./sustitucion-operaciones.component.scss']
})
export class SustitucionOperacionesComponent implements OnInit {

  //#region Variables

  /** Formulario reactivo para la carga de archivos */
  cargaForm: FormGroup;

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
    private _service: ServiceService,
    private _snackBar: MatSnackBar
  ) {}

  /**
   * Inicializa el formulario de carga al iniciar el componente.
   */
  ngOnInit(): void {
    this.cargaForm = this._formBuilder.group({
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
        this.cargaForm.controls['file'].setValue(file);
        this.fileError = '';
      } else {
        this.resetFile('Por favor, sube un archivo Excel válido', { invalidFile: true });
      }
    } else {
      if (!this.cargaForm.controls['file'].value) {
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
    this.cargaForm.controls['file'].setErrors(errorObj);
  }

  /**
   * Navega a la página de éxito si el formulario es válido.
   */
  loadFile(): void {
    if (this.cargaForm.invalid) {
      return;
    }
    this._router.navigate(['success']);
  }

  /**
   * Procesa el archivo cargado.
   * Aquí se debe implementar la lógica de procesamiento.
   */
procesar() {
  const file: File = this.cargaForm.get('file')?.value;
  console.log('[procesar] Archivo seleccionado:', file);

  if (!file) {
    this._snackBar.open('Debe seleccionar un archivo para procesar.', 'Cerrar', { duration: 3000 });
    console.warn('[procesar] No se seleccionó archivo.');
    return;
  }

  this._service.modificarOperaciones(file).subscribe({
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

  /**
   * Navega al menú principal.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/']);
  }
}