import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { User } from 'app/core/user/user.types';
import { ISelect } from 'app/models/login';
import { equipoDto } from 'app/models/usuario';
import { LoginService } from 'app/services/login.service';
import { SolicitudesService } from 'app/services/solicitudes.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-modal-ingresar-equipo',
  templateUrl: './modal-ingresar-equipo.component.html',
  styleUrls: ['./modal-ingresar-equipo.component.scss']
})
export class ModalIngresarEquipoComponent implements OnInit {
  user = {} as User;
  solicitudesDto = {} as any;
  usuario = {} as any;
  equipoFormulario: FormGroup;  
  idSolicitud : any;
  public serialLIST!: equipoDto;
  equipo = {} as any;
  Codserial = new FormControl('', Validators.required);


  
    //#region Select de serial
    protected serial : ISelect[] = [];
    public serialCtrl : FormControl = new FormControl();
    public serialFiltrosCtrl : FormControl = new FormControl();
    public filtroserial : ReplaySubject<ISelect[]> = new ReplaySubject<ISelect[]>(1);
    //#endregion

    

 

     //#region toast
     override2 = {
      positionClass: 'toast-bottom-full-width',
      closeButton: true,
      
    };
    //#endregion
    protected _onDestroy = new Subject<void>();
    
  constructor(public dialogRef: MatDialogRef<ModalIngresarEquipoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: equipoDto,  
               private _loginService : LoginService, 
              private _solicitudesService : SolicitudesService,
              public dialog: MatDialog,          
              private formBuilder : FormBuilder, ) {

                this.serialLIST = data;
                this.equipoFormulario= formBuilder.group({})

               }

               onNoClick(): void {
                this.dialogRef.close();
              }             

  ngOnInit(): void {
    this.listaSerial()
//#region select 

this.serialCtrl.setValue(this.serial);
this.filtroserial.next(this.serial);
this.serialFiltrosCtrl.valueChanges
.pipe(takeUntil(this._onDestroy))
.subscribe(() => {
  this.filtroCategoriaT();
  
});

 
//#endregion

  }

listaSerial(){

console.log(this.serialLIST.relacion, String(this.serialLIST.idTipoEquipo))

  this._solicitudesService.conusltarSerialXTipoEquipo( String(this.serialLIST.idTipoEquipo)).subscribe(
    (response) => {

      this.serial.push({name: 'Selecciones', id:''});
      if(response.estatus == 'SUCCESS'){
        for(const iterator of response.data){
          this.serial.push({name: iterator.serial, id:iterator.serial})
        }
      }
    
    }
    
  );
  
}
formIsValid:boolean =true;
asignar(){

  console.log(this.Codserial.value, this.serialLIST.relacion)

// Inside your component logic

  this._solicitudesService.consultarEquiposXserial( this.Codserial.value).subscribe(
    (response) => {

     console.log(response)
    this.serialLIST = response.data;
    this.dialogRef.close(this.serialLIST);
    }
    
  );
 
  

  


}


protected filtroCategoriaT() {
  if (!this.serial) {
    return;
  }
  // get the search keyword
  let search = this.serialFiltrosCtrl.value;
  if (!search) {
    this.filtroserial.next(this.serial.slice());
    return;
  } else {
    search = search.toLowerCase();
  }
  // filter the banks
  this.filtroserial.next(
    this.serial.filter(cargo => cargo.name.toLowerCase().indexOf(search) > -1)
  );
}



}
