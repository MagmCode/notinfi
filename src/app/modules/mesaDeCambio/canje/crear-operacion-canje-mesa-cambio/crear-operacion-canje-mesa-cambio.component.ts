/**
 * Componente para la gestión de la Crear Operación Canje en mesa de cambio.
 * Permite al usuario registrar una Crear Operación con los datos requeridos.
 * El formulario incluye campos predeterminados y es completamente reactivo.
 * Incluye navegación al menú principal y notificaciones.
 */

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'app/services/service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-crear-operacion-canje-mesa-cambio',
  templateUrl: './crear-operacion-canje-mesa-cambio.component.html',
  styleUrls: ['./crear-operacion-canje-mesa-cambio.component.scss']
})
export class CrearOperacionCanjeMesaCambioComponent implements OnInit {

  /**
   * Formulario reactivo para registrar una Crear Operación Canje.
   * Los valores iniciales pueden ser modificados por el usuario.
   */
  operaCanjeForm: FormGroup;

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
    this.operaCanjeForm = this._formBuilder.group({
      // Sección General
      rif: [''],
      nombre: [''],
      tipoCanje: [''],

      // Sección Entrega
      monedaEntrega: ['USD'],
      montoEntrega: ['0'],
      instrumentoEntrega: ['Efectivo'],
      cuentaConvenioEntrega: [''],
      cuentaClienteEntrega: [''],

      // Sección Recibe
      monedaRecibe: ['USD'],
      instrumentoRecibe: ['Efectivo'],
      cuentaConvenioRecibe: [''],
      cuentaClienteRecibe: [''],
    });
  }

  /**
   * Envía el formulario de Crear Operación Canje.
   * Actualmente solo imprime los datos en consola.
   * Puede ser extendido para enviar los datos al backend.
   */
  submit(): void {
    console.log('Formulario enviado:', this.operaCanjeForm.value);
    // Ejemplo de notificación
    this._snackBar.open('Crear Operación registrada correctamente.', 'Cerrar', { duration: 3000 });
  }

  /**
   * Navega al menú principal.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/']);
  }

}