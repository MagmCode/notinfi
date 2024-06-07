import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ISelect } from 'app/models/login';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  usuario = {} as any;
  solFormulario: FormGroup;
    //#region Select 
    protected estatus : ISelect[] = [];
    public estatusCtrl : FormControl = new FormControl();
    public estatusFiltrosCtrl : FormControl = new FormControl();
    public filtroestatus : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
    //#endregion
    protected _onDestroy = new Subject<void>();
    override2 = {
      positionClass: 'toast-bottom-full-width',
      closeButton: true,
      
    }; 
  constructor(private _solicitudesService : SolicitudesService,    
              private formBuilder : FormBuilder,              
              private _loginService : LoginService,
              private spinner: NgxSpinnerService, 
              private toast: ToastrService,) { 

                this.solFormulario = formBuilder.group({
     
                  fechaInicio: new FormControl('', [Validators.required]),
                  fechaFin :new FormControl('', [Validators.required]),
                  estatus :new FormControl('', [Validators.required])
            
                })



              }

  ngOnInit(): void {

       //#region select 
       this.obtenerEstatus();
       this.estatusCtrl.setValue(this.estatus);
       this.filtroestatus.next(this.estatus);
       this.estatusFiltrosCtrl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
         this.filtroestatusT();
       });
   //#endregion
  }
  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  async obtenerEstatus(){

 
    await this._solicitudesService.estatus().subscribe(
      (response) => {
    
        this.estatus.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
          for(const iterator of response.data){
            this.estatus.push({name: iterator.estatus, id:iterator.estatus})
          }
        }

        
      }
    );
   
  }  


  async descargarExcel(){

    if(this.solFormulario.valid){
      this.spinner.show();

      const datepipe: DatePipe = new DatePipe('en-US')
let fechaInicio = datepipe.transform(this.solFormulario.value.fechaInicio, 'dd/MM/YYYY');

let fechaFin = datepipe.transform(this.solFormulario.value.fechaFin, 'dd/MM/YYYY');

  await  this._solicitudesService.reporteTecServ(fechaInicio, fechaFin, this.solFormulario.value.estatus).subscribe(
        (data)=>{   

         

          const  blob = new Blob([data], {type : 'application/vnd.ms-excel'});
         
          const descargarURL = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = descargarURL;
          const fecha = new Date().toLocaleDateString();
          link.download = 'reporte_ '+ fecha +'.xls';
          link.click();
         this.spinner.hide();
        },
        (error) =>{
      
          this.spinner.hide();
        }
    ); 
    }else{
      this.toast.error('Verifique los Datos de las Secciones que son obligatorios no pueden estar vacios ', '', this.override2);
    } 

    
  }

  protected filtroestatusT() {
    if (!this.estatus) {
      return;
    }
    // get the search keyword
    let search = this.estatusFiltrosCtrl.value;
    if (!search) {
      this.filtroestatus.next(this.estatus.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtroestatus.next(
      this.estatus.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
    );
  }

}
