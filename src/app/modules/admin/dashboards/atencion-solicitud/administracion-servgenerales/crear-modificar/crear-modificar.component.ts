
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { servicioGenerales } from 'app/models/infraestructura';
import { ISelect } from 'app/models/login';
import { LoginService } from 'app/services/login.service';
import { ServigeneralesService } from 'app/services/servigenerales.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { OverlayRef, ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-crear-modificar',
  templateUrl: './crear-modificar.component.html',
  styleUrls: ['./crear-modificar.component.scss']
})
export class CrearModificarComponent implements OnInit {

  solFormulario: FormGroup; 
  datosSolicitud = {} as servicioGenerales;

  isShowCrear: boolean = false;
  isShowEditar: boolean = false;
  //#region Select 

  protected ListTipoSolicitud : ISelect[] = [];
  public ListTipoSolicitudCtrl : FormControl = new FormControl();
  public ListTipoSolicitudFiltrosCtrl : FormControl = new FormControl();
  public filtroListTipoSolicitud : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
 




  @ViewChild('multiSelect') multiSelect: MatSelect;
  //#endregion
  //#region toast
override2 = {
  positionClass: 'toast-bottom-full-width',
  closeButton: true,
  
};
//#endregion
protected _onDestroy = new Subject<void>();
//#region  spinner
private overlayRef!: OverlayRef;
//#endregion

  constructor(public dialogRef: MatDialogRef<CrearModificarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
     private _loginService : LoginService, 
    private _solicitudesService : SolicitudesService,
    private _serviGeneralesService : ServigeneralesService,
    public dialog: MatDialog,          
    private formBuilder : FormBuilder,              
    private toast: ToastrService,
    private spinner: NgxSpinnerService) {  }

  ngOnInit(): void {
    this.obtenerListTipoSolicitud(); 

if (this.data.tipo == 'crear') {
  
  this.solFormulario = this.formBuilder.group({
    idTipoSolicitudFk : new FormControl({value:  this.data.idTipoSolicitud,  disabled: true}),
    nombreTipoSolicitud: new FormControl(''),
    nombre : new FormControl('', [Validators.required]),
    requiereAprobacion: new FormControl('', [Validators.required]),
    tiempoRespuestaNum: new FormControl('', [Validators.required]),
    tiempoRespuesta: new FormControl('', [Validators.required]),
    estatus: new FormControl('', [Validators.required])
  })
  this.isShowCrear = true;
  this.isShowEditar = false;
} else{
debugger
  this.isShowCrear = false;
  this.isShowEditar = true;



  this.solFormulario = this.formBuilder.group({
    idTipSolDetallePk :   new FormControl({value:  this.data.solicitud.idTipSolDetallePk,  disabled: true}),
    idTipoSolicitudFk : new FormControl({value:  this.data.solicitud.idTipoSolicitudFk,  disabled: true}),
    tipoSolicitud: new FormControl(''),
    nombre : new FormControl(this.data.solicitud.nombre, [Validators.required]),
    requiereAprobacion: new FormControl(this.data.solicitud.requiereAprobacion, [Validators.required]),
    tiempoRespuestaNum: new FormControl(this.data.solicitud.tiempoRespuestaNum, [Validators.required]),
    tiempoRespuesta: new FormControl(this.data.solicitud.tiempoRespuesta, [Validators.required]),
    estatus: new FormControl(this.data.solicitud.estatus, [Validators.required])
  })


}

  }

  
  ngAfterViewInit() {

    this.ListTipoSolicitudCtrl.setValue(this.ListTipoSolicitud);
    this.filtroListTipoSolicitud.next(this.ListTipoSolicitud);
    this.ListTipoSolicitudFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtroListTipoSolicitudT();
      
    });
  
  
  

}


async obtenerListTipoSolicitud (){


  this._solicitudesService.tipoSolicitudServGene().subscribe(
    (response) => {
 

      this.ListTipoSolicitud.push({name: 'Selecciones', id:''});
      if(response.estatus == 'SUCCESS'){

        for(const iterator of response.data){
            this.ListTipoSolicitud.push({name:iterator.nombre, id:iterator.idTipoSolicitudPk})             
        }
           
      }
      
    }
  );

}




  onNoClick(): void {
    this.dialogRef.close();
  } 

  guardar(evento : any){

    this.datosSolicitud = {} as servicioGenerales;
    if (evento == 'c') {
      if (this.solFormulario.valid) {

      
      this._serviGeneralesService.crearTipoSolicitudDetalleSerGen(this.solFormulario.getRawValue()).subscribe(
        (data) =>{    
         if(data.estatus == "SUCCESS"){
          
       
        
          this.dialogRef.close(data.data[0]);
         
          this.toast.success(data.mensaje, '', this.override2);  
  
          }else{
  
  
            this.toast.error(data.mensaje, '', this.override2);
          }
          this.spinner.hide();
       this.spinner.hide('sp1'); 
              }, 
        (error) =>{
          this.toast.error('', '', this.override2);
        }
      );  



     
      
         
      
     
      } else {
      
       
          return;
      } 
    } else {
      if (this.solFormulario.valid) {
     
    
        this._serviGeneralesService.modificaTipoSolicitudDetSerGen(this.solFormulario.getRawValue()).subscribe(
          (data) =>{    
           if(data.estatus == "SUCCESS"){
            
    
          
            this.dialogRef.close(data.data[0]);
           
            this.toast.success(data.mensaje, '', this.override2);  
    
            }else{
    
    
              this.toast.error(data.mensaje, '', this.override2);
            }
            this.spinner.hide();
         this.spinner.hide('sp1'); 
                }, 
          (error) =>{
            this.toast.error('', '', this.override2);
          }
        );  
  
     
      } else {
      
       
          return;
      } 
    }
    
      
    
    
        
      
         
      
      
      }

protected filtroListTipoSolicitudT() {
  if (!this.ListTipoSolicitud) {
    return;
  }
  // get the search keyword
  let search = this.ListTipoSolicitudFiltrosCtrl.value;
  if (!search) {
    this.filtroListTipoSolicitud.next(this.ListTipoSolicitud.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the personals
  this.filtroListTipoSolicitud.next(
    this.ListTipoSolicitud.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
  );
}



}
