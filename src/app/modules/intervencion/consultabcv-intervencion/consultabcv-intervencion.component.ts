/**
 * consultabcv-intervencion.component.ts
 * Componente para la consulta BCV de intervención.
 * Permite seleccionar una fecha (preseleccionada al día de hoy y sin permitir fechas futuras)
 * y cargar un archivo, validando ambos campos antes de enviar.
 * 
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consultabcv-intervencion',
  templateUrl: './consultabcv-intervencion.component.html',
  styleUrls: ['./consultabcv-intervencion.component.scss'],
})
export class ConsultabcvIntervencionComponent implements OnInit {

  /** Formulario reactivo para la consulta BCV de intervención */
  consultaBCVInterForm: FormGroup;

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
   * - file: requerido.
   */
  ngOnInit(): void {
    this.consultaBCVInterForm = this._formBuilder.group({
      fecha: [this.today, [Validators.required]], // Preselecciona hoy
      file: ['', [Validators.required]]
    });
  }

  /**
   * Envía el formulario de consulta BCV.
   * Si el formulario es inválido, no realiza ninguna acción.
   * Aquí se debe implementar la lógica para el envío del formulario.
   */
  onSubmit(): void {
    if (this.consultaBCVInterForm.invalid) {
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
