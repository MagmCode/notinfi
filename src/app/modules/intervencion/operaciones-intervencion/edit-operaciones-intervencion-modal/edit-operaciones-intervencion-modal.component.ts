/**
 * Componente modal para la edición de operaciones de intervención.
 * Permite modificar los datos de una operación seleccionada desde la tabla principal.
 * Utiliza un formulario reactivo para validar y actualizar los campos editables.
 * Al guardar, realiza la petición al servicio para actualizar la operación y cierra el modal devolviendo la respuesta.
 * Incluye manejo de accesibilidad para guardar con la tecla Enter y validación de campos obligatorios.
 *
 * Funcionalidades principales:
 * - Visualizar y editar los datos de una operación de intervención.
 * - Validar los campos requeridos antes de guardar.
 * - Enviar los cambios al backend y cerrar el modal al finalizar.
 * - Cancelar la edición y cerrar el modal sin guardar.
 * - Accesibilidad: permite guardar usando la tecla Enter.
 *
 * Relacionado con: operaciones-intervencion.component.ts (abre este modal para editar).
 */
import { Component, Inject, OnInit, ViewEncapsulation, HostListener  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceService } from 'app/services/service.service';

@Component({
  selector: 'app-edit-operaciones-intervencion-modal',
  templateUrl: './edit-operaciones-intervencion-modal.component.html',
  styleUrls: ['./edit-operaciones-intervencion-modal.component.scss'],
})
export class EditOperacionesIntervencionModalComponent implements OnInit {

  /** Formulario reactivo para la edición de la operación */
  editForm: FormGroup;

  /**
   * Constructor del modal de edición.
   * @param dialogRef Referencia al diálogo para cerrar el modal.
   * @param data Datos de la operación a editar.
   * @param fb FormBuilder para crear el formulario reactivo.
   * @param _service Servicio para actualizar la operación.
   */
  constructor(
    public dialogRef: MatDialogRef<EditOperacionesIntervencionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _service: ServiceService,
  ) {}

  /**
   * Inicializa el formulario con los datos recibidos.
   */
  ngOnInit(): void {
    this.editForm = this.fb.group({
      idOper: [this.data.idOper,  [Validators.required, Validators.maxLength(10)]],
      nroCedRif: [this.data.nroCedRif, Validators.required],
      nomCliente: [this.data.nomCliente, Validators.required],
      fechOper: [this.data.fechOper, Validators.required],
      mtoDivisas: [this.data.mtoDivisas, Validators.required],
      ctaClienteDivisas: [this.data.ctaClienteDivisas, Validators.required],
      ctaCliente: [this.data.ctaCliente, Validators.required],
      codDivisas: [this.data.codDivisas, Validators.required],
    });
  }

  /**
   * Cierra el modal sin guardar cambios.
   */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Permite guardar usando la tecla Enter.
   * @param event Evento de teclado.
   */
  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: KeyboardEvent) {
    event.preventDefault(); 
    this.handleSave();
  }

  /**
   * Valida el formulario y guarda los cambios si es válido.
   */
  handleSave() {
    if (this.editForm.valid) {
      this.onSave();
    }
  }

  /**
   * Envía los datos editados al backend y cierra el modal con la respuesta.
   */
  onSave(): void {
    this._service.consultaIntervencion('intervencionEditar',this.editForm.value).subscribe(
      (response) => {
        this.dialogRef.close(response);
      },
      (error) => {
        console.error('Error updating intervencion:', error);
      }
    );
  }
}