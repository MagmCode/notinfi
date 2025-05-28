import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sustitucion-operaciones',
  templateUrl: './sustitucion-operaciones.component.html',
  styleUrls: ['./sustitucion-operaciones.component.scss']
})
export class SustitucionOperacionesComponent implements OnInit {

  cargaForm: FormGroup;
  fileName = '';
  fileError = '';
  private allowedExtensions = ['xls', 'xlsx', 'xlsm', 'xlsb', 'xlt', 'xltx', 'xltm'];

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.cargaForm = this._formBuilder.group({
      file: ['', Validators.required]
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
      if (this.allowedExtensions.includes(fileExtension)) {
        this.fileName = file.name;
        this.cargaForm.controls['file'].setValue(file);
        this.fileError = '';
      } else {
        this.resetFile('Por favor, sube un archivo Excel válido', { invalidFile: true });
      }
    } else {
      this.resetFile('Archivo inválido. Debe ser un archivo Excel', { required: true });
    }
  }

  private resetFile(errorMsg: string, errorObj: any): void {
    this.fileName = '';
    this.fileError = errorMsg;
    this.cargaForm.controls['file'].setErrors(errorObj);
  }

  loadFile(): void {
    if (this.cargaForm.invalid) {
      return;
    }
    this._router.navigate(['success']);
  }

  menuPrincipal(): void {
    this._router.navigate(['/menu-principal/']);
  }
}