import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from 'app/services/service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExportProgressService } from 'app/services/export-progress.service';

@Component({
  selector: 'app-consulta-definitiva-bcv',
  templateUrl: './consulta-definitiva-bcv.component.html',
  styleUrls: ['./consulta-definitiva-bcv.component.scss']
})
export class ConsultaDefinitivaBcvComponent implements OnInit, OnDestroy {

  /** Formulario reactivo para la consulta de jornada */
  consultaForm: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _service: ServiceService,
    private _snackBar: MatSnackBar,
    public exportProgressService: ExportProgressService // público para usar en el template
  ) {}

  ngOnInit(): void {
    this.consultaForm = this._formBuilder.group({
      cod: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.exportProgressService.limpiar();
  }

  /**
   * Inicia el proceso de exportación de la jornada usando el servicio reutilizable.
   */
  exportarJornada(): void {
    if (this.consultaForm.invalid) return;

    this.exportProgressService.iniciarProgreso(
      (blob: Blob, fileName: string) => {
        this.descargarArchivo(blob, fileName);
        this._snackBar.open('Archivo listo. La descarga comenzará en breve.', 'Cerrar', { duration: 4000 });
      },
      () => this._service.exportarConsultaDefinitiva({ fechaFiltro: this.consultaForm.value.cod })
    );
  }

  /**
   * Descarga el archivo recibido del backend en el navegador.
   * @param blob Archivo en formato Blob.
   * @param nombre Nombre sugerido para el archivo.
   */
  private descargarArchivo(blob: Blob, nombre: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nombre;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Navega al menú principal de la aplicación.
   */
  inicio(): void {
    this._router.navigate(['/menu-principal/']);
  }
}