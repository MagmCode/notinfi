import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

  /**
   * Constructor del componente.
   * @param _formBuilder Servicio para construir formularios reactivos.
   * @param _router Servicio de rutas de Angular.
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router
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
  exportarJornada(): void {
    // Logica para exportar la jornada
  }

  /**
   * Navega al menú principal de la aplicación.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/']);
  }
}