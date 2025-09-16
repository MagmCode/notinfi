/**
 * Componente para la gestión de la oferta interbancaria en mesa de cambio.
 * Permite al usuario registrar una oferta con los datos requeridos.
 * El formulario incluye campos predeterminados y es completamente reactivo.
 * Incluye navegación al menú principal y notificaciones.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'app/services/service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-oferta-interbancaria-mesa-cambio',
  templateUrl: './oferta-interbancaria-mesa-cambio.component.html',
  styleUrls: ['./oferta-interbancaria-mesa-cambio.component.scss']
})
export class OfertaInterbancariaMesaCambioComponent implements OnInit {

  /**
   * Formulario reactivo para registrar una oferta interbancaria.
   * Los valores iniciales pueden ser modificados por el usuario.
   */
  operaOfertaInterbancariaForm: FormGroup;

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
    this.operaOfertaInterbancariaForm = this._formBuilder.group({
      rif: ['G200099976'],                // RIF del ofertante
      nombre: ['BANCO DE VENEZUELA S.A.C.A.'], // Nombre del ofertante
      moneda: ['USD'],                    // Moneda de la operación
      monto: ['0'],                       // Monto de la operación
      tasa: [''],                         // Tasa de cambio
      codigoBanco: ['102'],               // Código del banco
      codigoJornada: ['xxxx'],            // Código de jornada
      cuentaCliente: [''],                // Cuenta del cliente
      cuentaConvenio: [''],               // Cuenta convenio
      instrumento: ['Efectivo'],          // Instrumento de la operación
    });
  }

  /**
   * Envía el formulario de oferta interbancaria.
   * Actualmente solo imprime los datos en consola.
   * Puede ser extendido para enviar los datos al backend.
   */
  crearOfertaInterbancaria(): void {
    console.log('Formulario enviado:', this.operaOfertaInterbancariaForm.value);
    // Ejemplo de notificación
    this._snackBar.open('Oferta registrada correctamente.', 'Cerrar', { duration: 3000 });
  }

  /**
   * Navega al menú principal.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/']);
  }

}