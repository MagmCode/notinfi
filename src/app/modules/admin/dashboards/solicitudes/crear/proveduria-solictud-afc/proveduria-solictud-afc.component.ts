import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { TooltipPosition } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ISelect } from 'app/models/login';
import { articulo } from 'app/models/proveduria';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Overlay, OverlayRef, ToastrService } from 'ngx-toastr';
import { ReplaySubject, Subject } from 'rxjs';
import {  takeUntil } from 'rxjs/operators';
import { DatosArticulosSolicitarComponent } from './datos-articulos-solicitar/datos-articulos-solicitar.component';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-proveduria-solictud-afc',
  templateUrl: './proveduria-solictud-afc.component.html',
  styleUrls: ['./proveduria-solictud-afc.component.scss']
})
export class ProveduriaSolictudAFCComponent implements OnInit {
  usuario = {} as any;
  articulo = {} as any;
  usuFormulario: FormGroup;
  isShownP: boolean = true; 
  isShownSU: boolean = false;
  isShownPT: boolean = false;
  mostrar: boolean = false;

  piso= new FormControl('', Validators.required);
  

  

    //#region Select

    protected codUnidad : ISelect[] = [];
    public codUnidadCtrl : FormControl = new FormControl();
    public codUnidadFiltrosCtrl : FormControl = new FormControl();
    public filtrocodUnidad : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
   

    protected ubicacion : ISelect[] = [];
    public ubicacionCtrl : FormControl = new FormControl();
    public ubicacionFiltrosCtrl : FormControl = new FormControl();
    public filtroubicacion : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
   
    protected detalleUbicacion : ISelect[] = [];
    public detalleUbicacionCtrl : FormControl = new FormControl();
    public detalleUbicacionFiltrosCtrl : FormControl = new FormControl();
    public filtrodetalleUbicacion : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
     
    protected supervisor : ISelect[] = [];
    public supervisorCtrl : FormControl = new FormControl();
    public supervisorFiltrosCtrl : FormControl = new FormControl();
    public filtrosupervisor : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
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
  
  //#region  tablas
  displayedColumns: string[] = ['id','codArticulo', 'dercripciónArt', 'cantidadArt','acciones'];
  positionOptions: TooltipPosition[] = ['below'];
  position = new FormControl(this.positionOptions[0]);
  dataSource: MatTableDataSource<articulo>;
  ELEMENT_DATA: articulo[] = [];
  
 @ViewChild(MatPaginator) paginator: MatPaginator | any;
 @ViewChild(MatSort) sort: MatSort = new MatSort;  
 @ViewChild(MatTable) table: MatTable<articulo>;
  //#endregion


  constructor(private _loginservices: LoginService,
             private _solicitudesService : SolicitudesService,
             private formBuilder : FormBuilder,
             private router: Router,
             private toast: ToastrService,
             private spinner: NgxSpinnerService,
             private overlay: Overlay,
             public dialog: MatDialog,) { 

      // Asi la data a elemento dataSource asi se vacia para su inicializacion
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA); 

              this.usuFormulario = formBuilder.group({

                codigoUsuario: new FormControl({value: null, readonly: true}),
                cedula: new FormControl({value: null, readonly: true}),
                nombres: new FormControl({value: null, readonly: true}),
                codUnidad: new FormControl('', [Validators.required] ),
                unidad: new FormControl({value: null, readonly: true}),
                codUnidadOrg:  new FormControl(''),
                unidadOrg: new FormControl(''),
                codUnidadJrq: new FormControl(''),
                unidadJrq: new FormControl(''),
                ubicacionFisica: new FormControl('', [Validators.required]),
                idServicio: new FormControl(''),
                responsable: new FormControl(''),
                codigoUsuarioResp: new FormControl(''),
                cedulaResp: new FormControl(''),
                nombresResp: new FormControl(''),
                codUnidadResp: new FormControl(''),
                unidadResp: new FormControl(''),
                codusuarioGestion:  new FormControl(''),
                /*  detalle : new FormControl('', [Validators.required]), */
                nroContacto : new FormControl('', [Validators.required])
        
              })

             }

  ngOnInit(): void {
   
   this.obtenerDatos(); 
  //#region select 

  this.codUnidadCtrl.setValue(this.codUnidad);
  this.filtrocodUnidad.next(this.codUnidad);
  this.codUnidadFiltrosCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filtrocodUnidadT();
    
  });


   this.ubicacionCtrl.setValue(this.ubicacion);
  this.filtroubicacion.next(this.ubicacion);
  this.ubicacionFiltrosCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filtroUbicacionT();
    
  });
              
              
  this.detalleUbicacionCtrl.setValue(this.detalleUbicacion);
  this.filtrodetalleUbicacion.next(this.detalleUbicacion);
  this.detalleUbicacionFiltrosCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filtrodetalleUbicacionT();
  });
           
  this.supervisorCtrl.setValue(this.supervisor);
  this.filtrosupervisor.next(this.supervisor);
  this.supervisorFiltrosCtrl.valueChanges
  .pipe(takeUntil(this._onDestroy))
  .subscribe(() => {
    this.filtrosupervisorT();
  });              
  //#endregion
              
                  
              
              
}   


ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

async obtenerDatos(){

  this.usuario = this._loginservices.obterTokenInfo();
    

  this._solicitudesService.consultarDetalleUsuario(this.usuario.codigo).subscribe(
    (data) =>{ 

      if( data.estatus ==  'SUCCESS'  ){
        this.usuFormulario.patchValue({
          codigoUsuario: data.data.codigo,
          cedula: data.data.cedula,
          nombres:   data.data.nombres + ' ' + data.data.apellidos,
          codUnidad: data.data.codUnidad,
          codusuarioGestion :  data.data.codigoSupervisor ,
          ubicacionFisica: data.data.codUbicacionFisica
        }); 
        this.piso =  new FormControl(data.data.detalleUbicacion)
       
        if (this.usuFormulario.value.ubicacionFisica) {
          this.mostrarInput();
        }

      }
             
    }, 

  );
 debugger
  this._solicitudesService.unidadesJerarguicaDescendente(this.usuario.codUnidad).subscribe(
    (response) => {
 
      this.codUnidad.push({name: 'Selecciones', id:''});
      if(response.estatus == 'SUCCESS'){
        for(const iterator of response.data){
          this.codUnidad.push({name:iterator.codUnidad+ ' ' +  iterator.unidad, id:iterator.codUnidad})
        }
       
      }

    }
  );



  this._solicitudesService.ubicacionFisica().subscribe(
    (response) => {
 
      this.ubicacion.push({name: 'Selecciones', id:''});
      if(response.estatus == 'SUCCESS'){
        for(const iterator of response.data){
          this.ubicacion.push({name: iterator.descripcion, id:iterator.codUbicacion})
        }
       
      }
      
    }
  );

  if (this.usuario.nivelCargo < 11 ) {
    this.isShownSU = true;

    this._solicitudesService.obtenerSupervisoresJRQ(this.usuario.codUnidadJrq ,this.usuario.nivelCargo,this.usuario.codigo ).subscribe(
      (response) => {
  
        this.supervisor.push({name: 'Selecciones', id:''});
        if(response.estatus == 'SUCCESS'){
          for(const iterator of response.data){
            this.supervisor.push({name: iterator.nombres + ' ' +iterator.apellidos , id:iterator.codUsuario})
          }
        }
    
      
        
      }
    );


  }


 
}  



mostrarInput(){

  this._solicitudesService.ubicacionFisicaDetalle(this.usuFormulario.value?.ubicacionFisica).subscribe(
     (response) => {
      
      this.detalleUbicacion.length = 0;
 
       this.detalleUbicacion.push({name: 'Selecciones', id:''});
       if(response.estatus == 'SUCCESS'){
 
         for(const iterator of response.data){
         
           if (this.usuFormulario.value?.ubicacionFisica == "OFICINA" || this.usuFormulario.value?.ubicacionFisica == "SUC") {
        
             this.detalleUbicacion.push({name:iterator.codDetalle +'-'+ iterator.detalle, id:iterator.codDetalle})
           } else {
             this.detalleUbicacion.push({name:iterator.detalle, id:iterator.codDetalle})
           }
         }
        
   
           this.isShownP = true;
           this.isShownPT = false;
       
 
       }else {
         this.isShownP = false;
         this.isShownPT = true;
       }
       
     }
   );
  }
 




  openDialog(): void {

    const dialogRef = this.dialog.open(DatosArticulosSolicitarComponent,{

      width: '50%',
      disableClose: true
    })
    
    dialogRef.afterClosed().subscribe(result => {
   
    debugger

   console.log(result)

   const  indice = this.dataSource.data.filter(elemento => elemento.codArticulo === result.codArticulo);

if (indice.length >  0) {
  this.toast.error(result.dercripcionArt + ' ya asignado' , '', this.override2);
  
} else {

  this.dataSource.data.push(result); 
  this.dataSource.data = this.dataSource.data.slice();
  this.ngAfterViewInit();
  

  
}
     
    });
  
    
  
  }

  deleteRow(rowToDelete: any) {
    // Assuming 'id' is the unique identifier property

    debugger
    const filteredData = this.dataSource.data.filter(row => row.codArticulo !== rowToDelete.codArticulo);
    this.dataSource.data = filteredData;
  
    // Optional: Send delete request to server or show confirmation message
    console.log('Row deleted:', rowToDelete);
  }

 //#region  inicializador de select

 



 protected filtrocodUnidadT() {
  if (!this.codUnidad) {
    return;
  }
  // get the search keyword
  let search = this.codUnidadFiltrosCtrl.value;
  if (!search) {
    this.filtrocodUnidad.next(this.codUnidad.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtrocodUnidad.next(
    this.codUnidad.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
  );
}

 protected filtroUbicacionT() {
  if (!this.ubicacion) {
    return;
  }
  // get the search keyword
  let search = this.ubicacionFiltrosCtrl.value;
  if (!search) {
    this.filtroubicacion.next(this.ubicacion.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtroubicacion.next(
    this.ubicacion.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
  );
}



protected filtrodetalleUbicacionT() {
  if (!this.detalleUbicacion) {
    return;
  }
  // get the search keyword
  let search = this.detalleUbicacionFiltrosCtrl.value;
  if (!search) {
    this.filtrodetalleUbicacion.next(this.detalleUbicacion.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtrodetalleUbicacion.next(
    this.detalleUbicacion.filter(tipo => tipo.name.toLowerCase().indexOf(search) > -1)
  );
}


protected filtrosupervisorT() {
  if (!this.supervisor) { 
    return;
  }
  // get the search keyword
  let search = this.supervisorFiltrosCtrl.value;
  if (!search) {
    this.filtrosupervisor.next(this.supervisor.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtrosupervisor.next(
    this.supervisor.filter(tipo => tipo.name.toLowerCase().indexOf(search) > -1)
  );
}


//#endregion
}

