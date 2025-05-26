import { Component, Inject, OnInit, ViewEncapsulation, HostListener  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceService } from 'app/services/service.service';
// import { format, parse } from 'date-fns';
@Component({
  selector: 'app-edit-operaciones-intervencion-modal',
  templateUrl: './edit-operaciones-intervencion-modal.component.html',
  styleUrls: ['./edit-operaciones-intervencion-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EditOperacionesIntervencionModalComponent implements OnInit {

  editForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditOperacionesIntervencionModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private _service: ServiceService,
    //  private someUpdateService: someUpdateService, 
  ) {}

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

  onNoClick(): void {
    this.dialogRef.close();
  }


  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: KeyboardEvent) {
    event.preventDefault(); 
    this.handleSave(); // Llama a una función auxiliar
  }

  handleSave() {
    if (this.editForm.valid) {
      this.onSave();
    }
  }
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