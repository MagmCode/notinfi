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
        title: 'SOCLICITUDES',
        subtitle: 'Gestion de Solicitudes',
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
        subtitle: 'Gestion de Areas Solucionadoras',
        type: 'group',
        icon: 'heroicons_outline:cog',
        children:[]
    };
    constructor(private _httpClient: HttpClient,
                private _loginService: LoginService
               )
    {
        
    }

    iniciarMenuAdmin(){
        return  this.menuAdministrado  ={
            id : 'servicios',
            title: 'Areas Solucionadora',
            subtitle: 'Gestion de Areas Solucionadoras',
            type: 'group',
            icon: 'heroicons_outline:cog',
            children:[]
        };
    }

    inciarMenuPublico(){
        return this.menuPublico  =[{
            id : 'Solicitudes',
            title: 'SOCLICITUDES',
            subtitle: 'Gestion de Solicitudes',
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
       return this._loginService.obtenerMenu(this.usuario.cedula).pipe(
          tap( (response) =>{
           
                if(response.status == 'success'){
                    this.menuReplicar.default = [];
                    response.data.forEach(element => {
                        this.menuAdministrado.children.push(element);
                    });
                    this.menuPublico.push(this.menuAdministrado);                   
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
