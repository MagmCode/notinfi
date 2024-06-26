import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { servicioGenerales } from 'app/models/infraestructura';
import { ISelect } from 'app/models/login';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
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
  evento = new FormControl('');
  
  protected tipoSolicitud : ISelect[] = [];
  public tipoSolicitudCtrl : FormControl = new FormControl();
  public tipoSolicitudFiltrosCtrl : FormControl = new FormControl();
  public filtrotipoSolicitud : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
 

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
        idTipoSolicitud : new FormControl(''),
        tipoSolicitud: new FormControl(''),
        idDetalleSol: new FormControl(''),
        detalleSol : new FormControl(''),
        observacion:new FormControl(''),
        requiereAprobacion: new FormControl(''),
        tiempoRespuestaNum: new FormControl(''),
        tiempoRespuesta: new FormControl(''),
          
      })

    }

  ngOnInit(): void {
    this.obtenerTipoSolicitud(); 
  }

  
  ngAfterViewInit() {

    this.tipoSolicitudCtrl.setValue(this.tipoSolicitud);
    this.filtrotipoSolicitud.next(this.tipoSolicitud);
    this.tipoSolicitudFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtrotipoSolicitudT();
      
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


async obtenerTipoSolicitud (){


  this._solicitudesService.tipoSolicitudServGene().subscribe(
    (response) => {
 

      this.tipoSolicitud.push({name: 'Selecciones', id:''});
      if(response.estatus == 'SUCCESS'){

        for(const iterator of response.data){
            this.tipoSolicitud.push({name:iterator.nombre, id:iterator.idTipoSolicirufPk})             
        }

      }
      
    }
  );

}


protected filtrotipoSolicitudT() {
  if (!this.tipoSolicitud) {
    return;
  }
  // get the search keyword
  let search = this.tipoSolicitudFiltrosCtrl.value;
  if (!search) {
    this.filtrotipoSolicitud.next(this.tipoSolicitud.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtrotipoSolicitud.next(
    this.tipoSolicitud.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
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
}
