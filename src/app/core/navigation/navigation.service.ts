import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Navigation } from 'app/core/navigation/navigation.types';
import { LoginService } from 'app/services/login.service';


@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    menuReplicar = {} as Navigation;
    /**
     * Constructor
     */
    usuario = {} as any;
     menuPublico : any =[{
        id : 'Solicitudes',
        title: 'SOLICITUDES',
        subtitle: 'Gestión de Solicitudes',
        type: 'group',
        icon: 'heroicons_outline:home',
        children:[{
            id: 'solici',
            title:'GESTIONAR SOLICITUDES',
            type: 'basic',
            icon: 'heroicons_outline:clipboard-check',
            link: '/solicitudes/gestionarSolicitudes'
        }]
    }];

    menuAdministrado : any ={
        id : 'servicios',
        title: 'Areas Solucionadora',
        subtitle: 'Gestión de Areas Solucionadoras',
        type: 'group',
        icon: 'heroicons_outline:cog',
        children:[{
            id: 'buzon',
            title:'Solicitudes Asignadas',
            type: 'basic',
            icon: 'heroicons_outline:clipboard-check',
            link: '/buzon/buzonAsignadas'
        }]
    };

    menuMediciones : any ={
        id : 'mediciones',
        title: 'Areas Indicadores',
        subtitle: 'Gestión de Areas Indicadores',
        type: 'group',
        icon: 'heroicons_outline:cog',
        children:[]
    };
/* 
    menuBandeja : any = {
            id : 'basignadas',
            title: 'Gestion Buzón',
            subtitle: 'Gestión de Solicitudes Asignadas',
            type: 'group',
            icon: 'heroicons_outline:home',
            children:[{
                id: 'solici',
                title:'Solicitudes Asignadas',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/buzon/buzonAsignadas'
            }]
         } */
    constructor(private _httpClient: HttpClient,
                private _loginService: LoginService
               )
    {
        
    }

    iniciarMenuAdmin(){
        return  this.menuAdministrado  ={
            id : 'servicios',
            title: 'Areas Solucionadora',
            subtitle: 'Gestión de Areas Solucionadoras',
            type: 'group',
            icon: 'heroicons_outline:cog',
            children:[{
                id: 'buzon',
                title:'Solicitudes Asignadas',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/buzon/buzonAsignadas'
            }]
        };
    }

    iniciarMenuMedi(){
        return  this.menuMediciones  ={
            id : 'mediciones',
            title: 'Areas Indicadores',
            subtitle: 'Gestión de Areas Indicadores',
            type: 'group',
            icon: 'heroicons_outline:cog',
            children:[]
        };
    }

    inciarMenuPublico(){
        return this.menuPublico  =[
           
            {
            id : 'Solicitudes',
            title: 'SOLICITUDES',
            subtitle: 'Gestión de Solicitudes',
            type: 'group',
            icon: 'heroicons_outline:home',
            children:[{
                id: 'solici',
                title:'GESTIONAR SOLICITUDES',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/solicitudes/gestionarSolicitudes'
            }]
        }];
    }

/*     iniciarBuzon(){
        return this.menuBandeja  = {
            id : 'basignadas',
            title: 'Gestion Buzón',
            subtitle: 'Gestión de Solicitudes Asignadas',
            type: 'group',
            icon: 'heroicons_outline:home',
            children:[{
                id: 'solici',
                title:'Solicitudes Asignadas',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-check',
                link: '/buzon/buzonAsignadas'
            }]
         }
    } */

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        console.log("iniciando get")
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        this.usuario = this._loginService.obterTokenInfo();
        this.menuReplicar.default = null;
        this.menuAdministrado = [];
        this.menuAdministrado = this.iniciarMenuAdmin();
        this.menuPublico = [];
        this.menuPublico = this.inciarMenuPublico();
        this.menuMediciones = [];
        this.menuMediciones = this.iniciarMenuMedi();
     
       return this._loginService.obtenerMenu(this.usuario.cedula).pipe(
          tap( (response) =>{
           
                if(response.status == 'success'){
                    let medi;
                    this.menuReplicar.default = [];
                    console.log(response)
                    response.data.forEach(element => {
                        console.log(element);
                        medi = element.title ;
                        if (element.title == 'Mediciones') {
                            element.icon = 'heroicons_outline:chart-pie';
                            this.menuMediciones.children.push(element);
                            
                        } else {
                            this.menuAdministrado.children.push(element); 
                      
                        }

                    });

                    if (medi == 'Mediciones') {
                        this.menuPublico.push(this.menuMediciones);  
                    } else {
                        this.menuPublico.push(this.menuAdministrado);  
                    }
        
                             
                    this.menuReplicar.default = [];
                    this.menuReplicar.default = this.menuPublico;
                    this._navigation.next(this.menuReplicar);
                    return of(this._navigation);
                }else{
                    this.menuReplicar.default = this.menuPublico;
                    this._navigation.next(this.menuReplicar);
                    return of(this._navigation);
                }
            })
        )
         // llamar al servicio de menu del proyecto
        
    }
}
