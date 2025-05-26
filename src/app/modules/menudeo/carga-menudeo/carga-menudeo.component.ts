import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'carga-menudeo',
  templateUrl: './carga-menudeo.component.html',
  styleUrls: ['./carga-menudeo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CargaMenudeoComponent implements OnInit {

  @ViewChild('cargaMenudeoForm') cargaMenudeoForm: NgForm;

  cargaaMenudeoForm: FormGroup;
  fileName: string = '';
  fileError: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,    
  ) {}

  ngOnInit(): void {
    this.cargaaMenudeoForm = this._formBuilder.group({
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
        this.cargaaMenudeoForm.controls['file'].setValue(file);
        this.fileError = '';
      } else {
        this.fileName = '';
        this.fileError = 'Por favor, sube un archivo Excel válido';
        this.cargaaMenudeoForm.controls['file'].setErrors({ invalidFile: true });
      }
    } else {
      this.fileError = 'Archivo inválido. Debe ser un archivo Excel';
      this.cargaaMenudeoForm.controls['file'].setErrors({ required: true }); 
    }
  }

  loadFile(): void {
    if (this.cargaaMenudeoForm.invalid) {
      return;
    }

    this._router.navigate(['success']);
  }

  menuPrincipal(): void {
    this._router.navigate(['/menu-principal/'])
  }
}

