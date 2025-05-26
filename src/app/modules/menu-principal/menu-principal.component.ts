import { Component, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { Navigation } from 'app/core/navigation/navigation.types';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
import { LoginService } from 'app/services/login.service';
import { ServiceService } from 'app/services/service.service';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MenuNode, ExampleFlatNode } from 'app/models/menu';



@Component({
    selector     : 'menu-principal',
    templateUrl  : './menu-principal.component.html',
    styleUrls    : ['./menu-principal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MenuPrincipalComponent implements OnInit, OnDestroy
{
    // isScreenSmall: boolean;
    // navigation: Navigation;
    // user = {} as User;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    menuData: FuseNavigationItem[];
    usuario = {} as any;
    // ifScreenSmall = window.innerWidth < 768;
    menuItems: MenuNode[] = [];
    isLoading: boolean = false;

    tasas: { compraUsd: string, compraEur: string, compraPTR: string, compraCNY: string, compraTRY: string, compraRUB: string } | null = null;
    loadingTasas = false;
    errorTasas = '';




    // Tree control properties
    private _transformer = (node: MenuNode, level: number) => {
    return {
        expandable: !!node.hijos && node.hijos.length > 0,
        nombre: node.nombre,
        nivel: node.nivel,
        id: node.id,
        level: level,
        configDir: node.configDir 
    };
    };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.nivel,
    node => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.hijos
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;



    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private _loginService : LoginService,
        private renderer: Renderer2,
        private _service: ServiceService,
        

    )
    {

    }


    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        this.loadMenu();
        this.obtenerTasas();
        // Subscribe to navigation data
        // aqui buscar el menu

    

        // // this.navigation = menu;
        // this._navigationService.navigation$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((navigation: Navigation) => {
        //         this.navigation = navigation;
        //     });

        // Subscribe to the user service
        // buscar usuario
        // Buscando usuario



        // this.usuario = this._loginService.obterTokenInfo();
        // this.user.name = this.usuario.nombres + ' ' +this.usuario.apellidos;  
        // this.user.email =this.usuario.descCargo;        
    

        // Subscribe to media changes
        // this._fuseMediaWatcherService.onMediaChange$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(({matchingAliases}) => {

        //         // Check if the screen is small
        //         this.isScreenSmall = !matchingAliases.includes('md');
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }


     loadMenu(): void {
    this._service.getMenu()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          // Filtrar solo los items habilitados y sus hijos habilitados
          this.menuItems = this.filterEnabledItems(response);
          this.dataSource.data = this.menuItems;
        },
        error: (err) => console.error('Error loading menu', err)
      });
  }

  // Método para expandir/colapsar nodos
toggleNode(node: ExampleFlatNode): void {
    this.treeControl.isExpanded(node) 
      ? this.treeControl.collapse(node) 
      : this.treeControl.expand(node);
  }
  

  private filterEnabledItems(items: MenuNode[]): MenuNode[] {
    return items
      .filter(item => item.habilitado)
      .map(item => ({
        ...item,
        hijos: item.hijos ? this.filterEnabledItems(item.hijos) : []
      }));
  }

  navigateTo(node: ExampleFlatNode): void {
    if (!node.configDir) {
      console.warn('El ítem del menú no tiene configDir definido');
      return;
    }
  
    try {
      this._router.navigate([node.configDir])
        .then(navigated => {
          if (!navigated) {
            console.warn(`No se pudo navegar a: ${node.configDir}`);
            // Opcional: redirigir a página por defecto
            this._router.navigate(['/']);
          }
        });
    } catch (error) {
      console.error('Error inesperado al navegar:', error);
      // Opcional: mostrar notificación al usuario
    }
  }



  obtenerTasas(): void {
    this.isLoading = true;

    this._service.tasas$.subscribe({
        next: (tasas) => {
            if (!tasas) {
                this._service.consultarTasas().subscribe({
                    next: (tasas)  => {
                        console.log('Tasas obtenidas:', tasas);
                        this.tasas = tasas;
                        setTimeout(() => {
                            this.isLoading = false;
                        }, 500);
                    },
                    error: (err) => {
                        console.error('Error al obtener tasas:', err);
                        this.isLoading = false;
                    }
                });
            } else {
                console.log('Tasas precargadas:', tasas);
                this.tasas = tasas;
                setTimeout(() => {
                    this.isLoading = false;
                }, 500);
            }
        },
        error: (err) => {
            console.error('Error al cargar tasas:', err);
            this.isLoading = false;
        }
    })
}
  



// // Routes Mesa de cambio
//     carga(): void {
//         this._router.navigate(['/mesa-de-cambio/carga'])
//     }
//     operaciones(): void {
//         this._router.navigate(['/mesa-de-cambio/operaciones'])
//     }
//     consultaBCVMesaCambio(): void {
//         this._router.navigate(['/mesa-de-cambio/consultaBCV'])
//     }
//     anulacionMasivaMesaCambio(): void {
//         this._router.navigate(['/mesa-de-cambio/anulacion-masiva'])
//     }
//     cambioClaveMesaCambio(): void {
//         this._router.navigate(['/mesa-de-cambio/cambio-de-clave'])
//     }
//     interbancarioMesaCambio(): void {
//         this._router.navigate(['/mesa-de-cambio/interbancario'])
//     }
//     demandaMesaCambio(): void {
//         this._router.navigate(['/mesa-de-cambio/demanda'])
//     }
//     cosultaIntercambioMesaCambio(): void {
//         this._router.navigate(['/mesa-de-cambio/consulta-intercambio'])
//     }
//     ofertaMesaCambio(): void {
//         this._router.navigate(['/mesa-de-cambio/oferta'])
//     }
   


// // Routes intervencion
// cargaInter(): void {
//     this._router.navigate(['/intervencion/carga'])
// }
// operacionesInter(): void {
//     this._router.navigate(['/intervencion/operaciones'])
// }

// interbancarioInter(): void {
//     this._router.navigate(['/intervencion/interbancario'])
// }

// cambioClaveInter(): void {
//     this._router.navigate(['/intervencion/cambio-de-clave'])
// }

// anulacionInter(): void {
//     this._router.navigate(['/intervencion/anulacion'])
// }

// consultaBCVInter(): void {
//     this._router.navigate(['/intervencion/consultaBCV'])
// }

// jornada(): void {
//     this._router.navigate(['/intervencion/jornada'])
// }


// // Routes Menudeo
// cargaMenudeo(): void {
//     this._router.navigate(['/menudeo/carga'])
// }
// operacionesMenudeo(): void {
//     this._router.navigate(['/menudeo/operaciones'])
// }
// cambioClaveMenudeo(): void {
//     this._router.navigate(['/menudeo/cambio-de-clave'])
// }
// demandaMenudeo(): void {
//     this._router.navigate(['/menudeo/demanda'])
// }
// consultaTasasBCVMenudeo(): void {
//     this._router.navigate(['/menudeo/consulta-tasasBCV'])
// }
// consultaBCVMenudeo(): void {
//     this._router.navigate(['/menudeo/consultaBCV'])
// }
// lecturaArchivoMenudeo(): void {
//     this._router.navigate(['/menudeo/lectura-de-archivo'])
// }
// ConsultaConciliacionMenudeo(): void {
//     this._router.navigate(['/menudeo/consulta-conciliacion'])
// }


    }
    
    


