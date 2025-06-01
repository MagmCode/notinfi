// #region Imports
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceService } from 'app/services/service.service';
// #endregion

/**
 * cambio-clave-intervencion.component.ts
 * Componente para el cambio de clave de intervención.
 * Permite al usuario cambiar su clave de intervención validando los campos y mostrando mensajes de error o éxito.
 * Incluye control de visibilidad de contraseñas y validaciones personalizadas.
 * Inspirado en la estructura y comentarios de sustituciones-pendientes.component.ts.
 */
@Component({
  selector: 'app-cambio-clave-intervencion',
  templateUrl: './cambio-clave-intervencion.component.html',
  styleUrls: ['./cambio-clave-intervencion.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class CambioClaveIntervencionComponent implements OnInit {

  /** Formulario reactivo para el cambio de clave */
  cambioClaveForm: FormGroup;

  /** Indica si la operación está en curso (muestra barra de carga) */
  isLoading: boolean = false;

  /** Controla la visibilidad de las claves en los campos de contraseña */
  showClaveActual = false;
  showClaveNueva = false;
  showConfirmarClave = false;

  /**
   * Constructor del componente.
   * @param _formBuilder Servicio para construir formularios reactivos.
   * @param _router Servicio de rutas de Angular.
   * @param _snackBar Servicio para mostrar notificaciones.
   * @param _service Servicio para operaciones de backend.
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _service: ServiceService
  ) {}

  /**
   * Inicializa el formulario reactivo con validaciones.
   * - claveActual: requerida.
   * - claveNueva: requerida, mínimo 6 caracteres.
   * - confirmarClave: requerida.
   * Aplica validador personalizado para coincidencia y diferencia de claves.
   */
  ngOnInit(): void {
    this.cambioClaveForm = this._formBuilder.group({
      claveActual: ['', [Validators.required]],
      claveNueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmarClave: ['', [Validators.required]]
    }, { validator: this.combinedValidators });
  }

  /**
   * Validador personalizado para el formulario:
   * - Verifica que la nueva clave y la confirmación coincidan (solo si el usuario ya escribió en confirmarClave).
   * - Verifica que la nueva clave no sea igual a la actual.
   * Asigna los errores solo a los campos correspondientes.
   */
  combinedValidators = (form: FormGroup) => {
    const claveNueva = form.get('claveNueva').value;
    const confirmarClave = form.get('confirmarClave').value;
    const claveActual = form.get('claveActual').value;

    // Limpia errores previos
    form.get('confirmarClave').setErrors(null);
    form.get('claveNueva').setErrors(null);

    // Solo valida si el usuario ya escribió algo en confirmarClave
    if (confirmarClave && claveNueva !== confirmarClave) {
      form.get('confirmarClave').setErrors({ clavesNoCoinciden: true });
    }

    // Validar que la clave nueva no sea igual a la actual
    if (claveActual && claveNueva && claveActual === claveNueva) {
      form.get('claveNueva').setErrors({ claveIgualActual: true });
    }

    return null;
  };

  /**
   * Envía el formulario para cambiar la clave.
   * Marca todos los campos como tocados si hay errores.
   * Llama al servicio para realizar el cambio de clave y muestra mensajes de éxito o error.
   */
  onSubmit(): void {
    this.cambioClaveForm.markAllAsTouched();
    this.isLoading = true;
    if (this.cambioClaveForm.invalid) {
      this.isLoading = false;
      // Los errores se muestran en los campos correspondientes
      return;
    }
    // Llamar al servicio para cambiar la clave
    const { claveActual, claveNueva } = this.cambioClaveForm.value;
    this._service.cambioClaveIntervencion({ claveActual, claveNueva }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response && response.error) {
          this._snackBar.open('Ocurrió un error al cambiar la clave', 'Cerrar', {
            duration: 5000,
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error']
          });
          return;
        }
        this._snackBar.open('La clave fue cambiada con éxito', 'Cerrar', {
          duration: 5000,
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });
        // Opcional: limpiar el formulario
        this.cambioClaveForm.reset();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en el cambio de clave:', err);
        this._snackBar.open('Ocurrió un error, vuelva a intentarlo', 'Cerrar', {
          duration: 5000,
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error']
        });
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
// #endregion
