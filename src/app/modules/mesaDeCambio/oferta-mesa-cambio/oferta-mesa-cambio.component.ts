import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oferta-mesa-cambio',
  templateUrl: './oferta-mesa-cambio.component.html',
  styleUrls: ['./oferta-mesa-cambio.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OfertaMesaCambioComponent implements OnInit {

  @ViewChild('ofertaMesaCambioForm') ofertaMesaCambioForm: NgForm;

  operofertaaMesaCambioForm: FormGroup;
  fileName: string = '';
  fileError: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,    
  ) {}

  ngOnInit(): void {
    this.operofertaaMesaCambioForm = this._formBuilder.group({
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
        this.operofertaaMesaCambioForm.controls['file'].setValue(file);
        this.fileError = '';
      } else {
        this.fileName = '';
        this.fileError = 'Por favor, sube un archivo Excel válido';
        this.operofertaaMesaCambioForm.controls['file'].setErrors({ invalidFile: true }); // Set custom error
      }
    } else {
      this.fileError = 'Archivo inválido. Debe ser un archivo Excel';
      this.operofertaaMesaCambioForm.controls['file'].setErrors({ required: true }); // Ensures it's marked as required
    }
  }

  loadFile(): void {
    if (this.operofertaaMesaCambioForm.invalid) {
      return;
    }

    this._router.navigate(['success']);
  }
}
