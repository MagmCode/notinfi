import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { solicitudesDto } from 'app/models/usuario';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { Overlay, OverlayRef, ToastrService } from 'ngx-toastr';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexFill,
  ApexLegend,
  ApexPlotOptions
} from "ng-apexcharts";


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
};


@Component({
  selector: 'app-reportes-generales',
  templateUrl: './reportes-generales.component.html',
  styleUrls: ['./reportes-generales.component.scss']
})
export class ReportesGeneralesComponent implements OnInit {
  id : any;
  buzon: any;
  asginadas : any;
  gestionadas: any;
  solicitudes: any;
  data: any;
  user = {} as User;
  usuario = {} as any;
  solicitudesDto = {} as any;
  plantillaUsuario = {} as solicitudesDto;
  
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  
    //#region  tablas
    displayedColumns: string[] = ['Idsolicitud','categoria', 'tipoServicio', 'servicio', 'codigoUsuario', 'cedula', 'nombres', 'codUnidad','unidad','ubicacionFisica', 'fechaCreacion', 'estatus','nombresResp', 'acciones'];
    positionOptions: TooltipPosition[] = ['below'];
    position = new FormControl(this.positionOptions[0]);
   
    dataSourceH: MatTableDataSource<solicitudesDto>;
    ELEMENT_HISTORICO: solicitudesDto[] = []; 
    @ViewChild(MatSort) sortH: MatSort = new MatSort;
    @ViewChild('paginatorH') paginatorH: MatPaginator;
   //#endregion
   //#region toast
override2 = {
  positionClass: 'toast-bottom-full-width',
  closeButton: true,
  
};
//#endregion

//#region  spinner
private overlayRef!: OverlayRef;
//#endregion
  constructor(public dialog: MatDialog,
              private _router: Router,
              private _loginService : LoginService,        
              private _loginservices: LoginService,
              private _solicitudesService : SolicitudesService, 
              private toast: ToastrService,
              private spinner: NgxSpinnerService,
              private componentFactoryResolver: ComponentFactoryResolver,
              private cdRef : ChangeDetectorRef,
              private overlay: Overlay,                
            private formBuilder : FormBuilder,
              private route: ActivatedRoute) {

                this.dataSourceH = new MatTableDataSource(this.ELEMENT_HISTORICO); 

                
               }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
    
      this.id = params['id']; // Obtén el valor del parámetro 'id'
      // Haz lo que necesites con el valor
    
    });

    this.obtenerPlantilla(this.id);
      
    this.usuario = this._loginService.obterTokenInfo();

    this.user.name = this.usuario.nombres + ' ' +this.usuario.apellidos;  
    this.user.email =this.usuario.descCargo;   
      
    this.dataSourceH.paginator = this.paginatorH;



 

  }

  ngAfterViewInit() {

    this.dataSourceH.paginator = this.paginatorH;
    this.dataSourceH.sort = this.sortH; 
   
  }

  applyFilterH(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceH.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceH.paginator) {
      this.dataSourceH.paginator.firstPage();
    }
  }

  tabClick(tab) {

    if (tab.index == 1 ) {

      this.ngAfterViewInit();

    }else{

      this.ngOnInit();
    }



  }

  async obtenerPlantilla(id: any){
    debugger
    this.usuario = this._loginservices.obterTokenInfo();

    this._solicitudesService.reporteXarea(id).subscribe(
    (response) =>{


      this.ELEMENT_HISTORICO = [];
      this.ELEMENT_HISTORICO = response.data.detalleSolicitudes;
      this.dataSourceH = new MatTableDataSource(this.ELEMENT_HISTORICO);
      this.ngAfterViewInit();

     
            this.buzon= response.data.estadistica.buzon;
            this.asginadas= response.data.estadistica.asginadas;
            this.gestionadas= response.data.estadistica.gestionadas;
            this.solicitudes= response.data.estadistica.solicitudes;
          

    






  
            var options = {
              series:response.data.graficaReporte.grafica,
              chart: {
              type: 'bar',
              stacked: true,
            },
            stroke: {
              width: 1,
              colors: ['#fff']
            },
           
            plotOptions: {
              bar: {
                horizontal: true
              }
            },
            xaxis: {
              categories:  response.data.graficaReporte.usuariosLabel   ,
            
            },
            title: {
              text: 'Solicitudes por usuario'
            },
            fill: {
              opacity: 1,
            },
            colors: ['#009681', '#E21050', '#82CACB', '#ED6D8F'],
            legend: {
              position: 'top',
              horizontalAlign: 'left'
            }
            };
    
            var chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();


            var optionst = {
              series: [response.data.solicituedesTyF.fueraTiempo , response.data.solicituedesTyF.enTiempo],
              chart: {
              width: 400,
              type: 'donut',
            },
            plotOptions: {
              pie: {
                startAngle: -90,
                endAngle: 270
              }
            },
            labels: ['Fuera de tiempo' , 'En Tiempo'] ,
            dataLabels: {
              enabled: false
            },
            fill: {
              type: 'gradient',
            },
            legend: {
               formatter: function(val, opts) {
                return val + " - " + opts.w.globals.series[opts.seriesIndex]
              }
            },
        
            title: {
              text: 'Solicitudes en Tiempo y Fuera de Tiempo'
            },
            colors: ['#DB0032', '#78BA49'],
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
            };
    
            var chart = new ApexCharts(document.querySelector("#chartT"), optionst);
            chart.render();
           
          
    }
    );



  }

  obtenerDatos(idSolicitud: any,idTipoServicio: any ){
        
    sessionStorage.setItem('idSolicitud', idSolicitud); 
  
          if (idTipoServicio == 1) {
            this._router.navigate(['/solicitudes/detalleSolicitud']); 
          
          } 
  
  if (idTipoServicio == 2) {
    
    
    this._router.navigate(['/solicitudes/detalleSolProveeduria']);
  }
  
  
  if (idTipoServicio == 3) {
    
    
    this._router.navigate(['/solicitudes/detalleSolServGenerales']);
  }
         
        
        }
}
