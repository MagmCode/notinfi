import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'carga-MesaCambio',
  templateUrl: './carga-MesaCambio.component.html',
  styleUrls: ['./carga-MesaCambio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CargaMesaCambioComponent implements OnInit {

  @ViewChild('cargaaForm') cargaaForm: NgForm;

  cargaForm: FormGroup;
  fileName: string = '';
  fileError: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,    
  ) {}

  ngOnInit(): void {
    this.cargaForm = this._formBuilder.group({
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
        this.cargaForm.controls['file'].setValue(file);
        this.fileError = '';
      } else {
        this.fileName = '';
        this.fileError = 'Por favor, sube un archivo Excel válido';
        this.cargaForm.controls['file'].setErrors({ invalidFile: true }); 
      }
    } else {
      this.fileError = 'Archivo inválido. Debe ser un archivo Excel';
      this.cargaForm.controls['file'].setErrors({ required: true }); 
    }
  }

  loadFile(): void {
    if (this.cargaForm.invalid) {
      return;
    }

    this._router.navigate(['success']);
  }

  menuPrincipal(): void {
    this._router.navigate(['/menu-principal/'])
  }
}