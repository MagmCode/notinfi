import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { articulo } from 'app/models/proveduria';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {
  detalle !: articulo;
  tituloModal : string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.titulo();
    console.log(this.data.articulo);
  }

  titulo():void{
    switch (this.data.articulo.acronimoTipoArticulo) {
      case "A":   
        this.tituloModal = 'Artículo';     
        break;
      case "F":
        this.tituloModal = 'Formulario';     
        break;
      case "C":
        this.tituloModal = 'Consumible de Impresora';
        break;
    }
  }

}
