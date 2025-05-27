import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceService } from 'app/services/service.service';

@Component({
  selector: 'app-cambio-clave-intervencion',
  templateUrl: './cambio-clave-intervencion.component.html',
  styleUrls: ['./cambio-clave-intervencion.component.scss'],
  // encapsulation: ViewEncapsulation.None
})
export class CambioClaveIntervencionComponent implements OnInit {

  @ViewChild('cambioClaveInterverForm') cambioClaveInterverForm: NgForm;

  cambioClaveeInterForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _service: ServiceService
  ) {}

  ngOnInit(): void {
    this.cambioClaveeInterForm = this._formBuilder.group({
      claveActual: ['', [Validators.required]],
      claveNueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmarClave: ['', [Validators.required]]
    }, { validator: this.combinedValidators });
  }

  combinedValidators = (form: FormGroup) => {
    const claveActual = form.get('claveActual').value;
    const claveNueva = form.get('claveNueva').value;
    const confirmarClave = form.get('confirmarClave').value;
    let errors: any = {};

    if (claveNueva !== confirmarClave) {
      errors.clavesNoCoinciden = true;
    }
    if (claveActual && claveNueva && claveActual === claveNueva) {
      errors.claveIgualActual = true;
    }
    return Object.keys(errors).length ? errors : null;
  };

  onSubmit(): void {
    this.isLoading = true;
    if (this.cambioClaveeInterForm.invalid) {
      this.cambioClaveeInterForm.markAllAsTouched();
      this.isLoading = false;
      if (this.cambioClaveeInterForm.hasError('clavesNoCoinciden')) {
        this._snackBar.open('Las claves no coinciden', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error']
        });
      }
      if (this.cambioClaveeInterForm.hasError('claveIgualActual')) {
        this._snackBar.open('La clave nueva no puede ser igual a la clave actual', 'Cerrar', {
          duration: 3000,
          verticalPosition: 'bottom',
          panelClass: ['snackbar-error']
        });
      }
      return;
    }
    // Llamar al servicio para cambiar la clave
    const { claveActual, claveNueva } = this.cambioClaveeInterForm.value;
    console.log('Datos enviados al backend:', { claveActual, claveNueva });
    this._service.cambioClaveIntervencion({ claveActual, claveNueva }).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response && response.error) {
          this._snackBar.open('Ocurrió un error al cambiar la clave', 'Cerrar', {
            duration: 5000,
            verticalPosition: 'bottom',
            panelClass: ['snackbar-error']
          });
          return
        }
        this._snackBar.open('La clave fue cambiada con éxito', 'Cerrar', {
          duration: 5000,
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        });
        // Opcional: limpiar el formulario
        this.cambioClaveeInterForm.reset();
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

  menuPrincipal(): void {
    this._router.navigate(['/menu-principal/'])
  }
}
