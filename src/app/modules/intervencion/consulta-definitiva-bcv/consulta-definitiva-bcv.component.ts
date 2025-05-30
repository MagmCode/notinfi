import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-consulta-definitiva-bcv',
  templateUrl: './consulta-definitiva-bcv.component.html',
  styleUrls: ['./consulta-definitiva-bcv.component.scss']
})
export class ConsultaDefinitivaBcvComponent implements OnInit {

  consultaForm: FormGroup;
  codNumber = '';
  codError = '';

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.consultaForm = this._formBuilder.group({
      cod: ['', Validators.required]
    });
  }

  exportarJornada(): void {
    // Logica para exportar la jornada
  }

  menuPrincipal(): void {
    this._router.navigate(['/menu-principal/']);
  }
}