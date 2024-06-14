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
import { forIn, groupBy } from 'lodash';

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


  async obtenerPlantilla(id: any){
    this.usuario = this._loginservices.obterTokenInfo();

    this._solicitudesService.reporteXarea(id).subscribe(
    (response) =>{

      console.log(response)
      this.ELEMENT_HISTORICO = [];
      this.ELEMENT_HISTORICO = response.data.detalleSolicitudes;
      this.dataSourceH = new MatTableDataSource(this.ELEMENT_HISTORICO);
      this.ngAfterViewInit();

     
            this.buzon= response.data.estadistica.buzon;
            this.asginadas= response.data.estadistica.asginadas;
            this.gestionadas= response.data.estadistica.gestionadas;
            this.solicitudes= response.data.estadistica.solicitudes;
          

            var dataEmple    = [];        
            var dataCantidad = [];
            var dataDecision = [];
            var dataServicio = [];
        
            var dataserie    = [];  
          
            const results= groupBy(response.data.gestionesSolictud, (a) => a.nombreUsuario);
            
   
        for (const key in results) {
          if (Object.prototype.hasOwnProperty.call(results, key)) {
            const element = results[key];
            dataEmple.push(element[0].nombreUsuario);

            const resul= groupBy(element, (a) => a.servcio);

            console.log(resul);

                  for (const key in resul) {
                    if (Object.prototype.hasOwnProperty.call(resul, key)) {
                      const element = resul[key];
debugger
                      dataServicio.push(element)
                      console.log(element);
                      
                    }
                  }
           

               
          }
        }

         /*    response.data.gestionesSolictud.forEach( element => {
              

              
             dataCantidad.push(element.cantidad);
             dataDecision.push(element.decision);
             dataServicio.push(element.servcio);
            
        
           });  */
            
         
            console.log(dataEmple);
            console.log(dataCantidad);
            console.log(dataServicio);
        
            var options = {
              series: [
                {
                  name: 'Aprobado Budget',
                  group: 'budget',
                  data: [44, 55, 41, 67, 22,40, 65, 25]
                },
                {
                  name: 'Aprobado Actual',
                  group: 'actual',
                  data: [48, 50, 40, 65, 25,40, 65, 25]
                },
                {
                  name: 'Rechazado Budget',
                  group: 'budget',
                  data: [13, 36, 20, 8, 13,40, 65, 25]
                },
                {
                  name: 'Rechazado Actual',
                  group: 'actual',
                  data: [20, 40, 25, 10, 12,40, 65, 25]
                }
            
            ],
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
              categories:  dataEmple   ,
            
            },
            fill: {
              opacity: 1,
            },
            colors: ['#80c7fd', '#008FFB', '#80f1cb', '#00E396'],
            legend: {
              position: 'top',
              horizontalAlign: 'left'
            }
            };
    
            var chart = new ApexCharts(document.querySelector("#chart"), options);
            chart.render();
           
          
    }
    );



  }


}
