import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'consultabcv-menudeo',
  templateUrl: './consultabcv-menudeo.component.html',
  styleUrls: ['./consultabcv-menudeo.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ConsultabcvMenudeoComponent implements OnInit {
  @ViewChild('consultaMenudeoForm') consultaMenudeoForm: NgForm;

  consultaBCVMenudeoForm: FormGroup;
  fileName: string = '';
  fileError: string = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,    
  ) {}

  ngOnInit(): void {
    this.consultaBCVMenudeoForm = this._formBuilder.group({
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
        this.consultaBCVMenudeoForm.controls['file'].setValue(file);
        this.fileError = '';
      } else {
        this.fileName = '';
        this.fileError = 'Por favor, sube un archivo Excel válido';
        this.consultaBCVMenudeoForm.controls['file'].setErrors({ invalidFile: true }); // Set custom error
      }
    } else {
      this.fileError = 'Archivo inválido. Debe ser un archivo Excel';
      this.consultaBCVMenudeoForm.controls['file'].setErrors({ required: true }); // Ensures it's marked as required
    }
  }

  loadFile(): void {
    if (this.consultaBCVMenudeoForm.invalid) {
      return;
    }

    this._router.navigate(['success']);
  }

  menuPrincipal(): void {
    this._router.navigate(['/menu-principal/'])
  }
}
