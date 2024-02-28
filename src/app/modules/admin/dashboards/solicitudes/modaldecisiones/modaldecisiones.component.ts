import {  Component,  Inject, OnInit } from '@angular/core';
import {  FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'app/services/login.service';
import { MatDialogRef , MAT_DIALOG_DATA } from '@angular/material/dialog';
import { solicitudesDto, usuario } from 'app/models/usuario';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerComponent } from 'app/modules/admin/spinner/spinner.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { ISelect } from 'app/models/login';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-modaldecisiones',
  templateUrl: './modaldecisiones.component.html',
  styleUrls: ['./modaldecisiones.component.scss']
})
export class ModaldecisionesComponent implements OnInit {
  solicitudesDto = {} as any;
  usuario = {} as any;
  datosFormulario: FormGroup;
  public solicitud!: solicitudesDto;
  selectedOption: string;
  isShownA: boolean = false; // Inicialmente oculto
  isShownR: boolean = false;
  isShownM: boolean = false;
  mensaje : any;
  idSolicitud : any;
  nombres : any;
  tipoServicio: any;

    //#region toast
override2 = {
  positionClass: 'toast-bottom-full-width',
  closeButton: true,
  
};
//#endregion
  //#region Select de MOTIVP
  protected motivo : ISelect[] = [];
  public motivoCtrl : FormControl = new FormControl();
  public motivoFiltrosCtrl : FormControl = new FormControl();
  public filtromotivo : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
  //#endregion

    //#region Select de MetodosAutenticacion
    protected metodo : ISelect[] = [];
    public metodoCtrl : FormControl = new FormControl();
    public metodoFiltrosCtrl : FormControl = new FormControl();
    public filtrometodo : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
    //#endregion
  protected _onDestroy = new Subject<void>();

  //#region  spinner
private overlayRef!: OverlayRef;
//#endregion
  constructor(public dialogRef: MatDialogRef<ModaldecisionesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: solicitudesDto,
              private _loginservices: LoginService,
              private _solicitudesService : SolicitudesService,
              private overlay: Overlay,              
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService,
              private formBuilder : FormBuilder,
              private route: ActivatedRoute) { 
                
                this.solicitud = data;

                this.datosFormulario = formBuilder.group({
                  
                  idSolicitud:  new FormControl({value: null, readonly: true}),
                  codigoUsuario: new FormControl({value: null, readonly: true}),
                  cedula: new FormControl({value: null, readonly: true}),
                  nombres: new FormControl({value: null, readonly: true}),
                  codUnidad: new FormControl({value: null, readonly: true}),
                  unidad: new FormControl({value: null, readonly: true}),
                  codUnidadOrg: new FormControl({value: null, readonly: true}),
                  unidadOrg: new FormControl({value: null, readonly: true}),
                  codUnidadJrq: new FormControl({value: null, readonly: true}),
                  unidadJrq: new FormControl({value: null, readonly: true}),
                  decision: new FormControl({value: null, readonly: true}),
                  motivo:  new FormControl('', [Validators.required]),
                  observacion : new FormControl(''),
                })




              }

  ngOnInit(): void {
    this.obtenerDatos();
    //#region select 
    this.obtenerMotivo();
    this.motivoCtrl.setValue(this.motivo);
    this.filtromotivo.next(this.motivo);
    this.motivoFiltrosCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filtroMotivoT();
    });
    //#endregion

       //#region select 
       this.metodoCtrl.setValue(this.metodo);
       this.filtrometodo.next(this.metodo);
       this.metodoFiltrosCtrl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
         this.filtroMetodoT();
       });
       //#endregion
  }


   obtenerMotivo(){
     this._solicitudesService.consultarMotivo().subscribe(
      (response) => {
        console.log(response.data)
        this.motivo.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
          for(const iterator of response.data){
            this.motivo.push({name: iterator.nombre, id:iterator.id})
          }
        }
        
      }
    );

   

    this._solicitudesService.consultarMetodosAutenticacion().subscribe(
     (response) => {
       console.log(response.data)
       this.metodo.push({name: 'Selecciones', id:''});
       if(response.estatus == 'SUCCESS'){
         for(const iterator of response.data){
           this.metodo.push({name: iterator.nombre, id:iterator.idAutenticacion})
           console.log(  this.metodo);
         }
       }
       
     }
   );

 } 
  
  async obtenerDatos(){
    console.log( this.solicitud.categoria + '-'+ this.solicitud.tipoServicio  + '-'+  this.solicitud.servicio  );
     
         
            this.idSolicitud = this.solicitud.idSolicitud,
            this.nombres =   this.solicitud.nombres,
            this.tipoServicio= this.solicitud.categoria + '-'+ this.solicitud.tipoServicio  + '-'+  this.solicitud.servicio  
        
      if (this.solicitud.decision  == 'A') {
        this.isShownA = true,
        this.isShownR = false,
        this.mensaje = "¿Usted esta seguro de aprobar la siguiente solicitud?";
      } else {
        this.isShownR = true,
        this.isShownM = true,
        this.isShownA = false,
        this.mensaje = "¿Usted esta seguro de rechazar la siguiente solicitud?";
      }


   
  } 

  Aprobar(){
    console.log(this.datosFormulario.value.idSolicitud)

    this.spinner.show();
    this.usuario = this._loginservices.obterTokenInfo();
    console.log(this.usuario);
    console.log(this.datosFormulario.value.idSolicitud)

    this._solicitudesService.consultarDetalleUsuario(this.usuario.codigo).subscribe(
      (data) =>{ 
        console.log(data.data)    
        if(typeof data.data !=  'undefined'  ){
          this.datosFormulario.patchValue({
         
            codigoUsuario:data.data.codigo,
            cedula:data.data.cedula,
            nombres:data.data.nombres + ' ' + data.data.apellidos,
            codUnidad:data.data.codUnidad,
            unidad:data.data.descUnidad,
            codUnidadOrg: data.data.codUnidadOrg,
            unidadOrg: data.data.unidadOrg,
            codUnidadJrq: data.data.codUnidadJrq,
            unidadJrq: data.data.unidadJrq
            
    
          }); 
      
    
          
          this.datosFormulario.value.decision = 'A';
          this.datosFormulario.value.idSolicitud =  this.idSolicitud;
          this.datosFormulario.value.motivo = 0;
    
         
          console.log(   this.datosFormulario.value);
    
          this._solicitudesService.gestionFlujoTarea(this.datosFormulario.value).subscribe(
            (data) =>{    
             console.log(data);
              if(data.estatus == "SUCCESS"){
                this.toast.success(data.mensaje + " Número de solicitud " + data.data.idSolicitud, '', this.override2);            
                setTimeout(()=>{
                  this.refrescarPagina();
              },1500);  
              this.dialogRef.close();
              }else{
                this.toast.error(data.mensaje, '', this.override2);
              }
              this.spinner.hide();
          /*     this.spinner.hide('sp1'); */
                  }, 
            (error) =>{
              this.toast.error(data.mensaje, '', this.override2);
            }
          ); 
    
        }else{
          this.toast.error(data.mensaje, '', this.override2);
        }
               
      }, 
    
    );


  }

  Rechazar(){
    console.log(this.datosFormulario.value.idSolicitud)
    this.spinner.show();
    this.usuario = this._loginservices.obterTokenInfo();
    console.log(this.usuario);
    console.log(this.datosFormulario.value.idSolicitud)

    this._solicitudesService.consultarDetalleUsuario(this.usuario.codigo).subscribe(
      (data) =>{ 
        console.log(data.data)    
        if(typeof data.data !=  'undefined'  ){
          this.datosFormulario.patchValue({
            codigoUsuario:data.data.codigo,
            cedula:data.data.cedula,
            nombres:data.data.nombres + ' ' + data.data.apellidos,
            codUnidad:data.data.codUnidad,
            unidad:data.data.descUnidad,
            codUnidadOrg: data.data.codUnidadOrg,
            unidadOrg: data.data.unidadOrg,
            codUnidadJrq: data.data.codUnidadJrq,
            unidadJrq: data.data.unidadJrq
            
    
          }); 
    
    
          
          this.datosFormulario.value.decision = 'R';
          this.datosFormulario.value.idSolicitud = this.idSolicitud;
          this.datosFormulario.value.motivo =  this.datosFormulario.value.motivo?.id;
          console.log(   this.datosFormulario.value);
          
    
          this._solicitudesService.gestionFlujoTarea(this.datosFormulario.value).subscribe(
            (data) =>{    
             console.log(data);
              if(data.estatus == "SUCCESS"){
                this.toast.success(data.mensaje + " Número de solicitud " + data.data.idSolicitud, '', this.override2);            
                setTimeout(()=>{
                  this.refrescarPagina();
              },1500);  
              this.dialogRef.close();
              }else{
                this.toast.error(data.mensaje, '', this.override2);
              }
              this.spinner.hide();
          /*     this.spinner.hide('sp1'); */
                  }, 
            (error) =>{
              this.toast.error(data.mensaje, '', this.override2);
            }
          ); 
    
        }else{
          this.toast.error(data.mensaje, '', this.override2);
        }
               
      }, 
    
    );
  }

  refrescarPagina() {
    /* this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([], { relativeTo: this.route });
    }); */
    window.location.reload();
  }

  redirigirSuccess(){
  
    this.router.navigate(['/solicitudes/gestionarSolicitudes']);
   }
   
   public show(message = '') {
     // Returns an OverlayRef (which is a PortalHost)
   
     if (!this.overlayRef) {
       this.overlayRef = this.overlay.create();
     }
   
     // Create ComponentPortal that can be attached to a PortalHost
     const spinnerOverlayPortal = new ComponentPortal(SpinnerComponent);
     const component = this.overlayRef.attach(spinnerOverlayPortal); // Attach ComponentPortal to PortalHost
   }


     //#region  inicializador de select


  protected filtroMotivoT() {
    if (!this.motivo) {
      return;
    }
    // get the search keyword
    let search = this.motivoFiltrosCtrl.value;
    if (!search) {
      this.filtromotivo.next(this.motivo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtromotivo.next(
      this.motivo.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
    );
  }

  protected filtroMetodoT() {
    if (!this.metodo) {
      return;
    }
    // get the search keyword
    let search = this.metodoFiltrosCtrl.value;
    if (!search) {
      this.filtrometodo.next(this.metodo.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filtrometodo.next(
      this.metodo.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
    );
  }
   //#endregion

}
