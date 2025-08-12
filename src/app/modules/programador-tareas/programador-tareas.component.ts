import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from 'app/services/service.service';

@Component({
  selector: 'app-programador-tareas',
  templateUrl: './programador-tareas.component.html',
  styleUrls: ['./programador-tareas.component.scss']
})
export class ProgramadorTareasComponent implements OnInit {

  sistemas: any[] = [];
  sistemasPaginados = [];
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  horas = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
  minutos = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
cadaMin = Array.from({ length: 59 }, (_, i) => (i + 1).toString()); 
  pageIndex = 0;
  pageSize = 5;

  constructor(
    private serviceService: ServiceService,
    private router: Router
  ) { }

ngOnInit() {
  // Comentado: llamada al backend
  this.serviceService.programadorTareas().subscribe((res: any[]) => {
    this.sistemas = res.map(item => {
      const [dia, hora, minuto, horaDesde, horaHasta, cadaMin] = item.valueScreen.split('/');
      return {
        id: item.id,
        nombre: item.description,
        dia: dia !== '0' ? dia : '',
        hora: hora !== '0' ? hora : '',
        minuto: minuto !== '0' ? minuto : '',
        horaDesde,
        horaHasta,
        cadaMin: cadaMin,
        activo: item.estado === 1
      };
    });
    this.updatePaginados();
  });

  // Datos de prueba
  // this.sistemas = [
  //   {
  //     id: 1,
  //     nombre: 'OPICS',
  //     dia: '',
  //     hora: '',
  //     minuto: '',
  //     horaDesde: '08',
  //     horaHasta: '17',
  //     cadaMin: '1',
  //     activo: false
  //   },
  //   {
  //     id: 2,
  //     nombre: 'SWIFT',
  //     dia: '',
  //     hora: '',
  //     minuto: '',
  //     horaDesde: '09',
  //     horaHasta: '12',
  //     cadaMin: '1',
  //     activo: false
  //   },
  //   {
  //     id: 3,
  //     nombre: 'TEST',
  //     dia: '',
  //     hora: '',
  //     minuto: '',
  //     horaDesde: '0',
  //     horaHasta: '0',
  //     cadaMin: '0',
  //     activo: true
  //   }
  // ];
  // this.updatePaginados();
}

  procesarTareas() {
  const payload = this.sistemas.map(sistema => ({
    id: sistema.id,
    description: sistema.nombre,
    estado: sistema.activo ? 1 : 0,
    valueScreen: [
      sistema.dia ? sistema.dia : '0',
      sistema.hora ? sistema.hora : '0',
      sistema.minuto ? sistema.minuto : '0',
      sistema.horaDesde ? sistema.horaDesde : '0',
      sistema.horaHasta ? sistema.horaHasta : '0',
      sistema.cadaMin ? sistema.cadaMin : '0'
    ].join('/')
  }));

  // // Llama al servicio para enviar el arreglo al backend
  this.serviceService.actualizarProcesos(payload).subscribe(resp => {
    // Maneja la respuesta aquí (mostrar mensaje, refrescar datos, etc.)
        console.log('Respuesta del backend:', resp);
  });

  // Solo muestra el JSON en consola para pruebas
  console.log('JSON enviado:', JSON.stringify(payload, null, 2));
}

inicio() {
  this.router.navigate(['/menu-principal/']);
}

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginados();
  }

  updatePaginados() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.sistemasPaginados = this.sistemas.slice(start, end);
  }
}