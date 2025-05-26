import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'interbancario-mesa-cambio',
  templateUrl: './interbancario-mesa-cambio.component.html',
  styleUrls: ['./interbancario-mesa-cambio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InterbancarioMesaCambioComponent implements OnInit {

  @ViewChild('interbancarioMesaCambioForm') interbancarioMesaCambioForm: NgForm;

  operinterbancariooMesaCambioForm: FormGroup;
  fileName: string = '';
  fileError: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,    
  ) {}

  ngOnInit(): void {
    this.operinterbancariooMesaCambioForm = this._formBuilder.group({
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
        this.operinterbancariooMesaCambioForm.controls['file'].setValue(file);
        this.fileError = '';
      } else {
        this.fileName = '';
        this.fileError = 'Por favor, sube un archivo Excel válido';
        this.operinterbancariooMesaCambioForm.controls['file'].setErrors({ invalidFile: true }); // Set custom error
      }
    } else {
      this.fileError = 'Archivo inválido. Debe ser un archivo Excel';
      this.operinterbancariooMesaCambioForm.controls['file'].setErrors({ required: true }); // Ensures it's marked as required
    }
  }

  loadFile(): void {
    if (this.operinterbancariooMesaCambioForm.invalid) {
      return;
    }

    this._router.navigate(['success']);
  }
}
