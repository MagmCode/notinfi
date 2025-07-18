import { Component, OnInit } from '@angular/core';
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

  constructor(private serviceService: ServiceService) { }

  ngOnInit() {
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