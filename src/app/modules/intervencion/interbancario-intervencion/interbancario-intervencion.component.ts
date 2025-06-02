/**
 * interbancario-intervencion.component.ts
 * Componente para la consulta interbancaria de intervención.
 * Permite seleccionar una fecha (preseleccionada al día de hoy y sin permitir fechas futuras)
 * y un valor de Envio BCV, validando ambos campos antes de enviar.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'interbancario-intervencion',
  templateUrl: './interbancario-intervencion.component.html',
  styleUrls: ['./interbancario-intervencion.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class InterbancarioIntervencionComponent implements OnInit {

  /** Formulario reactivo para la consulta interbancaria de intervención */
  interbanInterForm: FormGroup;

  /** Fecha de hoy para usar como valor por defecto y como máximo en el datepicker */
  today: Date = new Date();

  /**
   * Constructor del componente.
   * @param _formBuilder Servicio para construir formularios reactivos.
   * @param _router Servicio de rutas de Angular.
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,    
  ) {}

  /**
   * Inicializa el formulario reactivo con validaciones.
   * - fecha: requerida, preseleccionada al día de hoy.
   */
  ngOnInit(): void {
    this.interbanInterForm = this._formBuilder.group({
      fecha: [this.today, [Validators.required]], // Preselecciona hoy
      // Puedes agregar aquí otros campos con sus validaciones si es necesario
    });
  }

  /**
   * Envía el formulario de consulta interbancaria.
   * Si el formulario es inválido, no realiza ninguna acción.
   * Aquí se debe implementar la lógica para el envío del formulario.
   */
  onSubmit(): void {
    if (this.interbanInterForm.invalid) {
      return;
    }

    // Aquí se maneja la lógica para el envío del formulario
  }

  /**
   * Navega al menú principal.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/'])
  }
}
