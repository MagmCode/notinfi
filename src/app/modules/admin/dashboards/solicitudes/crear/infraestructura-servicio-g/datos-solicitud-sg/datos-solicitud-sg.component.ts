import { SelectionModel } from '@angular/cdk/collections';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { servicioGenerales } from 'app/models/infraestructura';
import { ISelect } from 'app/models/login';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { forEach } from 'lodash';
import { OverlayRef, ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-datos-solicitud-sg',
  templateUrl: './datos-solicitud-sg.component.html',
  styleUrls: ['./datos-solicitud-sg.component.scss']
})
export class DatosSolicitudSgComponent implements OnInit {
  solFormulario: FormGroup; 
  datosSolicitud = {} as servicioGenerales;
  personalCargo  = new FormControl('', Validators.required);
  


  isShowPersonal : boolean = false;
  //#region Select de tipo personal
      protected personal : ISelect[] = [];
      public personalCtrl : FormControl = new FormControl();
      public personalFiltrosCtrl : FormControl = new FormControl();
      public filtropersonal : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
      //#endregion
  protected ListTipoSolicitud : ISelect[] = [];
  public ListTipoSolicitudCtrl : FormControl = new FormControl();
  public ListTipoSolicitudFiltrosCtrl : FormControl = new FormControl();
  public filtroListTipoSolicitud : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
 

  protected detalleSolicitud : ISelect[] = [];
  public detalleSolicitudCtrl : FormControl = new FormControl();
  public detalleSolicitudFiltrosCtrl : FormControl = new FormControl();
  public filtrodetalleSolicitud : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
 
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

  constructor(public dialogRef: MatDialogRef<DatosSolicitudSgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
     private _loginService : LoginService, 
    private _solicitudesService : SolicitudesService,
    public dialog: MatDialog,          
    private formBuilder : FormBuilder,              
    private toast: ToastrService) { 


      this.solFormulario = formBuilder.group({
        id: new FormControl(''),
        idTipoSolicitud : new FormControl('', [Validators.required]),
        tipoSolicitud: new FormControl(''),
        idDetalleSol: new FormControl('', [Validators.required]),
        detalleSol : new FormControl(''),
        observacion:new FormControl('', [Validators.required]),
        requiereAprobacion: new FormControl(''),
        tiempoRespuestaNum: new FormControl(''),
        tiempoRespuesta: new FormControl(''),
          evento:new FormControl(''),
      })

    }

  ngOnInit(): void {
    this.obtenerListTipoSolicitud(); 

if (this.data) {
  
   this.datosSolicitud = this.data.solicitud

   this.solFormulario = this.formBuilder.group({
    idTipoSolicitud:  new FormControl( this.datosSolicitud.idTipoSolicitud),
   
  })
  let cod: string[];
  this.mostrarInput();
  
if (this.datosSolicitud.personal != undefined) {
   cod =  this.datosSolicitud.personal.split(',');
   this.personalCargo.patchValue(sessionStorage.getItem('perso'));
   
} 
 

  this.solFormulario = this.formBuilder.group({
    id: new FormControl( this.datosSolicitud.relacion),
    idTipoSolicitud:  new FormControl({value:  Number(this.datosSolicitud.idTipoSolicitud),  disabled: true}),
   evento :  new FormControl( this.datosSolicitud.evento),
    idDetalleSol: new FormControl(this.datosSolicitud.idDetalleSol+'-'+this.datosSolicitud.requiereAprobacion+'-'+this.datosSolicitud.tiempoRespuestaNum+'-'+this.datosSolicitud.tiempoRespuesta, [Validators.required]) ,
    tiempoRespuesta:  new FormControl({value : this.datosSolicitud.tiempoRespuestaNum+' ' +this.datosSolicitud.tiempoRespuesta, disabled: true}),
    observacion:new FormControl(this.datosSolicitud.observacion, [Validators.required]),
   
  })

  
this.isShowPersonal = true;
  this._solicitudesService.consultarobtenerPlantilla('', '52115').subscribe(
    (response) => {
      
      this.personal.push({name: 'Selecciones', id:''});
      if(response.status == 'success'){
        for(const iterator of response.usuariosLts){
          
          this.personal.push({name: iterator.nombres + ' ' + iterator.apellidos , id:iterator.codigo + ' ' + iterator.nombres + ' ' + iterator.apellidos })
        }
      }
  
    
      
    }
  );

  
    //#region select de personal
    this.personalCtrl.setValue(this.personal);
    this.filtropersonal.next(this.personal);
    this.personalFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtropersonalT();
    });
     //#endregion

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
  
  
     this.detalleSolicitudCtrl.setValue(this.detalleSolicitud);
    this.filtrodetalleSolicitud.next(this.detalleSolicitud);
    this.detalleSolicitudFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtrodetalleSolicitudT();
      
    });
                
  

    //#endregion
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

mostrarInput(){
 

   this._solicitudesService.tipoSolicitudDetalleServGene(this.solFormulario.value.idTipoSolicitud).subscribe(
    (response) => {
 
      this.detalleSolicitud.length = 0;
  

      this.detalleSolicitud.push({name: 'Selecciones', id:''});
      if(response.estatus == 'SUCCESS'){

        for(const iterator of response.data){
            this.detalleSolicitud.push({name:iterator.nombre, id:iterator.idTipSolDetallePk + '-' +iterator.requiereAprobacion  + '-' + iterator.tiempoRespuestaNum + '-' + iterator.tiempoRespuesta})             
        }
  
      }
      this.detalleSolicitudCtrl.setValue(this.detalleSolicitud);
      this.filtrodetalleSolicitud.next(this.detalleSolicitud);
      this.detalleSolicitudFiltrosCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtrodetalleSolicitudT();
      });

   
      
    }
  ); 

 

  }

  mostrar(){


    let cod: string[] =  this.solFormulario.getRawValue().idDetalleSol.split('-');

    
    var uni = cod[2]+ ' ' + cod[3];




  this.solFormulario = this.formBuilder.group({
    idTipoSolicitud:  new FormControl(this.solFormulario.getRawValue().idTipoSolicitud,  [Validators.required]),
   
    idDetalleSol: new FormControl(this.solFormulario.value.idDetalleSol, [Validators.required]) ,
    tiempoRespuesta:  new FormControl(uni),
    observacion:new FormControl(this.solFormulario.value.observacion, [Validators.required]), 
   
  }) 




  }

  onNoClick(): void {
    this.dialogRef.close();
  } 
  asignar(){

    
    this.datosSolicitud = {} as servicioGenerales;
    if (this.solFormulario.valid) {
      let cod: string[] =  this.solFormulario.getRawValue().idDetalleSol.split('-');

    
      this.datosSolicitud.relacion =this.solFormulario.getRawValue().id;
        this.datosSolicitud.idTipoSolicitud = this.solFormulario.getRawValue().idTipoSolicitud;
        this.datosSolicitud.tipoSolicitud = document.querySelector('#selectTsol')?.textContent;
        this.datosSolicitud.idDetalleSol  = cod[0]
        this.datosSolicitud.detalleSol  = document.querySelector('#selectDescrTsol')?.textContent;
       
        this.datosSolicitud.requiereAprobacion =   cod[1];
        this.datosSolicitud.tiempoRespuestaNum =   cod[2];
        this.datosSolicitud.tiempoRespuesta =   cod[3];
        this.datosSolicitud.observacion =   this.solFormulario.getRawValue().observacion; 
        
        if ( this.solFormulario.getRawValue().evento != undefined) {
       
          this.datosSolicitud.evento = this.solFormulario.getRawValue().evento;
         
          if (this.personalCargo.value.length == 0) {
            return
          }else{
            var perso: any = '';
            sessionStorage.setItem('perso', this.personalCargo.value);
            this.personalCargo.value.forEach(element => {

              
                if (perso =='') {
                  perso = element.id ;
                } else {
                  perso= perso +', ' + element.id ;
                }

            });
            this.datosSolicitud.personal = perso;
          }
        }
    
      this.dialogRef.close(this.datosSolicitud);
    
       
    
   
    } else {
    
     
        return;
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
  // filter the banks
  this.filtroListTipoSolicitud.next(
    this.ListTipoSolicitud.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
  );
}

 protected filtrodetalleSolicitudT() {
  if (!this.detalleSolicitud) {
    return;
  }
  // get the search keyword
  let search = this.detalleSolicitudFiltrosCtrl.value;
  if (!search) {
    this.filtrodetalleSolicitud.next(this.detalleSolicitud.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtrodetalleSolicitud.next(
    this.detalleSolicitud.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
  );
}

protected filtropersonalT() {
  if (!this.personal) { 
    return;
  }
  // get the search keyword
  let search = this.personalFiltrosCtrl.value;
  if (!search) {
    this.filtropersonal.next(this.personal.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtropersonal.next(
    this.personal.filter(tipo => tipo.name.toLowerCase().indexOf(search) > -1)
  );
}
}
