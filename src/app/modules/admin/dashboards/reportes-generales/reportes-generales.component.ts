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
import { ChartComponent } from 'ng-apexcharts';
import { NgxSpinnerService } from 'ngx-spinner';
import { Overlay, OverlayRef, ToastrService } from 'ngx-toastr';



export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
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
            response.data.gestionesSolictud.forEach( element => {
              

              dataEmple.push(element.nombreUsuario);
              dataCantidad.push(element.cantidad);
              dataDecision.push(element.decision);
              dataServicio.push(element.servcio);
             
         
            });

            var optionsServi = {
              chart: {
                stacked: true,
  stackType: "100%",
                width: "100%",
                height: 380,
                type: "bar",
                animations: {
                  enabled: true,
                  easing: 'easeinout',
                  speed: 800,
                  animateGradually: {
                      enabled: true,
                      delay: 150
                  },
                  dynamicAnimation: {
                      enabled: true,
                      speed: 350
                  }
              }
              },
              plotOptions: {
                bar: {
                  horizontal: true,
                  borderRadius: 20
                }
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                width: 1,
                colors: ["#fff"]
              },
              series: [{
                data: [{
                  x: 'category A',
                  y: 10,
                  goals: [
                    {
                      name: 'Expected',
                      value: 52,
                      strokeColor: '#775DD0'
                    }
                  ]
                }, {
                  x: 'category B',
                  y: 18,
                  goals: [
                    {
                      name: 'Expected',
                      value: 52,
                      strokeColor: '#775DD0'
                    }
                  ]
                }, {
                  x: 'category C',
                  y: 13,
                  goals: [
                    {
                      name: 'Expected',
                      value: 52,
                      strokeColor: '#775DD0'
                    }
                  ]
                }]
              }],
             
              legend: {
                position: "right",
                verticalAlign: "top",
                containerMargin: {
                  left: 35,
                  right: 60
                }
              },
              responsive: [
                {
                  breakpoint: 1000,
                  options: {
                    plotOptions: {
                      bar: {
                        horizontal: false
                      }
                    },
                    legend: {
                      position: "bottom"
                    }
                  }
                }
              ],
            
            };
            
            var chartServi = new ApexCharts(
              document.querySelector("#responsive-chart"),
              optionsServi
            );
            
            chartServi.render();

          
    }
    );



  }


}
