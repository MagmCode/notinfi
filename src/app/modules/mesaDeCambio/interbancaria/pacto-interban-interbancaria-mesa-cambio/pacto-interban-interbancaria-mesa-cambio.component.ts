/**
 * Componente para la gestión de la Pacto Interbancario interbancaria en mesa de cambio.
 * Permite al usuario registrar una Pacto Interbancario con los datos requeridos.
 * El formulario incluye campos predeterminados y es completamente reactivo.
 * Incluye navegación al menú principal y notificaciones.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'app/services/service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pacto-interban-interbancaria-mesa-cambio',
  templateUrl: './pacto-interban-interbancaria-mesa-cambio.component.html',
  styleUrls: ['./pacto-interban-interbancaria-mesa-cambio.component.scss']
})
export class PactoInterbanInterbancariaMesaCambioComponent implements OnInit {

  /**
   * Formulario reactivo para registrar una Pacto Interbancario interbancaria.
   * Los valores iniciales pueden ser modificados por el usuario.
   */
  pactoInterbancarioForm: FormGroup;

  /**
   * Constructor del componente.
   * @param _formBuilder Servicio para construir formularios reactivos.
   * @param _router Servicio de rutas de Angular.
   * @param _service Servicio para operaciones de negocio (no usado en este componente, pero disponible para futuras extensiones).
   * @param _snackBar Servicio para mostrar notificaciones tipo snackbar.
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _service: ServiceService,
    private _snackBar: MatSnackBar,
  ) {}

  /**
   * Inicializa el formulario con valores predeterminados.
   * Los valores pueden ser modificados por el usuario antes de enviar.
   */
  ngOnInit(): void {
    this.pactoInterbancarioForm = this._formBuilder.group({

      codigoJornada: ['xxxx'],            // Código de jornada
      codOferta: [''],                 // Código de la oferta
      codDemanda: [''],                // Código de la demanda
      monto: ['0'],                       // Monto de la operación
      tasa: ['0'],                         // Tasa de cambio
      tipoPacto: [''],                   // Tipo de Pacto
    });
  }

  /**
   * Envía el formulario de Pacto Interbancario interbancaria.
   * Actualmente solo imprime los datos en consola.
   * Puede ser extendido para enviar los datos al backend.
   */
  submit(): void {
    console.log('Formulario enviado:', this.pactoInterbancarioForm.value);
    // Ejemplo de notificación
    this._snackBar.open('Pacto Interbancario registrada correctamente.', 'Cerrar', { duration: 3000 });
  }

  /**
   * Navega al menú principal.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/']);
  }

}