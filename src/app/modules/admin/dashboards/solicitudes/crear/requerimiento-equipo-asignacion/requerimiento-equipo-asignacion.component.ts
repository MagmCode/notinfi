import { Component, OnInit } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-requerimiento-equipo-asignacion',
  templateUrl: './requerimiento-equipo-asignacion.component.html',
  styleUrls: ['./requerimiento-equipo-asignacion.component.scss']
})
export class RequerimientoEquipoAsignacionComponent implements OnInit {
  selectedOption: string;

  constructor() { }

  ngOnInit(): void {
  }

isShown: boolean = false; // Inicialmente oculto

handleRadioChange(event: MatRadioChange): void {
  this.selectedOption = event.value; // Actualiza la propiedad con el valor seleccionado


  console.log( this.selectedOption);



  
}


}
