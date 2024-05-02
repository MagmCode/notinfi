import { SelectionModel } from '@angular/cdk/collections';
import { OverlayRef } from '@angular/cdk/overlay';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { User } from 'app/core/user/user.types';
import { equipoDto, solicitudesDto } from 'app/models/usuario';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal-desicion-sop',
  templateUrl: './modal-desicion-sop.component.html',
  styleUrls: ['./modal-desicion-sop.component.scss']
})
export class ModalDesicionSopComponent implements OnInit {

  user = {} as User;
  solicitudesDto = {} as any;
  usuario = {} as any; 
  datosFormulario: FormGroup;
  public solicitud!: solicitudesDto;
  idSolicitud : any;
  isShownA: boolean = false; // Inicialmente oculto
  isShownR: boolean = false;
  observacion = new FormControl('', Validators.required);
  mensaje : any;
  equipos  = new FormControl('', Validators.required);

  displayedColumnsE: string[] = ['select','tipoEquipo','serial', 'marca', 'modelo',  'bienNacional'];
  positionOptionsE: TooltipPosition[] = ['below'];
  positionE = new FormControl(this.positionOptionsE[0]);
  dataSourceE: MatTableDataSource<equipoDto>;    
  selection = new SelectionModel<equipoDto>(true, []);

  ELEMENT_DATAE: equipoDto[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort = new MatSort; 
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
  constructor(public dialogRef: MatDialogRef<ModalDesicionSopComponent>,
              @Inject(MAT_DIALOG_DATA) public data: solicitudesDto,  
              private _loginService : LoginService, 
              private _solicitudesService : SolicitudesService,
              public dialog: MatDialog,          
              private formBuilder : FormBuilder, 
              private _loginservices: LoginService,
              private router: Router,
              private spinner: NgxSpinnerService,
              private toast: ToastrService,) {

                this.solicitud = data;
                this.dataSourceE = new MatTableDataSource(this.ELEMENT_DATAE); 
               
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
                  motivo:  new FormControl(''),
                  observacion : new FormControl(''),
                  codusuarioGestion:  new FormControl(''),
                })

               }

  ngOnInit(): void {

    this.obtenerDatos();
  }

  ngAfterViewInit() {
    this.dataSourceE.paginator = this.paginator;
    this.dataSourceE.sort = this.sort;
  }

  applyFilterE(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceE.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSourceE.paginator) {
      this.dataSourceE.paginator.firstPage();
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceE.data.length;
  
    return numSelected === numRows;
  }
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
  
    this.selection.select(...this.dataSourceE.data);
  }
  checkboxLabel(row?: equipoDto): string {
  
    if (!row) {
   
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.relacion + 1}`;
  }

  async obtenerDatos(){

    if (this.solicitud.decision  == 'A') {
      this.isShownA = true;
      this.isShownR = false;
      this.mensaje = "Seleccione el/los equipos averiados";
      this._solicitudesService.consultarEquipoPorUsuario(this.solicitud.codigoUsuario).subscribe(
        (response) => {
          if(response.estatus == 'SUCCESS'){
           
            this.ELEMENT_DATAE = [];
            this.ELEMENT_DATAE = response.data;
            this.dataSourceE = new MatTableDataSource(this.ELEMENT_DATAE);
            this.ngAfterViewInit();
            this.dataSourceE.paginator = this.paginator;
            this.dataSourceE.sort = this.sort;
            
          }
          
        } ); 

    }else{

      this.isShownR = true,
      this.isShownA = false,
      this.mensaje = "Detalle de la solución";

      

    }
   


  }


  
  reportar(){

  this.spinner.show();
  this.usuario = this._loginservices.obterTokenInfo();
  
  this._solicitudesService.consultarDetalleUsuario(this.usuario.codigo).subscribe(
  (data) =>{ 
  
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
   
    if (this.selection.selected.length == 0) {
      this.toast.error('Seleccione Equipo', '', this.override2);
      return
    }
   
    if (this.observacion.value == '') {
      this.observacion =  new FormControl('', Validators.required);
      this.toast.error('Observación no puede estar vacia', '', this.override2);
      return
     }
  
    this.datosFormulario.value.decision = 'A';
    this.datosFormulario.value.idSolicitud =  this.solicitud.idSolicitud;
    this.datosFormulario.value.motivo = 0;
    this.datosFormulario.value.observacion = this.observacion.value
   



  var enviarData = {};
  enviarData= {
  "solicitud":this.datosFormulario.value,
  "formulario":this.selection.selected
  }
  
   this._solicitudesService.gestionFlujoTarea(enviarData).subscribe(
  (data) =>{    
  
  if(data.estatus == "SUCCESS"){
  this.toast.success(data.mensaje + " Número de solicitud " + data.data.idSolicitud, '', this.override2);            
  setTimeout(()=>{
  this.redirigirSuccess();
  },1500);  
  this.dialogRef.close();
  }else{
  this.toast.error(data.mensaje, '', this.override2);
  }
  this.spinner.hide();
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

  
  solucionado(){
    this.spinner.show();
    this.usuario = this._loginservices.obterTokenInfo();


    this._solicitudesService.consultarDetalleUsuario(this.usuario.codigo).subscribe(
      (data) =>{ 
    
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
    
          if (this.observacion.value == '') {
            this.observacion =  new FormControl('', Validators.required);
            this.toast.error('Observación no puede estar vacia', '', this.override2);
            return
           }
          
          this.datosFormulario.value.decision = 'S';
          this.datosFormulario.value.idSolicitud = this.solicitud.idSolicitud;
          this.datosFormulario.value.motivo = 0;
          this.datosFormulario.value.observacion = this.observacion.value;

          
          var enviarData = {};
          enviarData= {
           "solicitud":this.datosFormulario.value,
           "formulario":[]
          }
          
    
          this._solicitudesService.gestionFlujoTarea(enviarData).subscribe(
            (data) =>{    
           
              if(data.estatus == "SUCCESS"){
                this.toast.success(data.mensaje + " Número de solicitud " + data.data.idSolicitud, '', this.override2);            
                setTimeout(()=>{
                  this.redirigirSuccess();
              },1500);  
              this.dialogRef.close();
              }else{
                this.toast.error(data.mensaje, '', this.override2);
              }
              this.spinner.hide();
      
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


  redirigirSuccess(){
   
  
      this.router.navigate(['/buzon/buzonAsignadas']);

      
 
   }
}
