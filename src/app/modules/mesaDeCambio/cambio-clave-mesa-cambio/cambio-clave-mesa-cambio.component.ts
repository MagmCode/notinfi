import { viewClassName } from '@angular/compiler';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'cambio-clave-mesa-cambio',
  templateUrl: './cambio-clave-mesa-cambio.component.html',
  styleUrls: ['./cambio-clave-mesa-cambio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CambioClaveMesaCambioComponent implements OnInit {
  @ViewChild('cambioClaveMesaCambioForm') cambioClaveMesaCambioForm: NgForm;

  cambioClaveeMesaCambioForm: FormGroup;
  fileName: string = '';
  fileError: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,    
  ) {}

  ngOnInit(): void {
    this.cambioClaveeMesaCambioForm = this._formBuilder.group({
      file: ['', [Validators.required]]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name;
      const fileExtension = fileName.split('.').pop()?.toLowerCase();

      const allowedExtensions = ['xls', 'xlsx', 'xlsm', 'xlsb', 'xlt', 'xltx', 'xltm'];

      if (allowedExtensions.includes(fileExtension)) {
        this.fileName = fileName;
        this.cambioClaveeMesaCambioForm.controls['file'].setValue(file);
        this.fileError = '';
      } else {
        this.fileName = '';
        this.fileError = 'Por favor, sube un archivo Excel válido';
        this.cambioClaveeMesaCambioForm.controls['file'].setErrors({ invalidFile: true }); // Set custom error
      }
    } else {
      this.fileError = 'Archivo inválido. Debe ser un archivo Excel';
      this.cambioClaveeMesaCambioForm.controls['file'].setErrors({ required: true }); // Ensures it's marked as required
    }
  }

  loadFile(): void {
    if (this.cambioClaveeMesaCambioForm.invalid) {
      return;
    }

    this._router.navigate(['success']);
  }


  menuPrincipal(): void {
    this._router.navigate(['/menu-principal/'])
  }
}
