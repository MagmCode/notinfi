import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FuseNavigationItem} from "@fuse/components/navigation";
import { Navigation } from "app/core/navigation/navigation.types";
import { User } from "app/core/user/user.types";
import { LoginService } from "app/services/login.service";
import { AuthService } from "app/core/auth/auth.service";
import { ServiceService } from "app/services/service.service";
import { MenuNode, ExampleFlatNode } from "app/models/menu";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "classy-layout",
  templateUrl: "./classy.component.html",
  styleUrls: ["./classy.component.scss"],
  // encapsulation: ViewEncapsulation.None
})
export class ClassyLayoutComponent implements OnDestroy, OnInit {
  isScreenSmall: boolean;
  navigation: Navigation;
  user = {} as User;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  menuData: FuseNavigationItem[];
  usuario = {} as any;
  isSidebarOpened = false;
  opened: boolean;
  events: string[] = [];
  isLoading: boolean = false;

  ifScreenSmall = window.innerWidth < 768;

  tasas: { compraUsd: string; compraEur: string } | null = null;
  loadingTasas = false;
  errorTasas = "";
  menuItems: MenuNode[] = [];
  selectedNodeId: number | null = null;

  selectNode(node: ExampleFlatNode): void {
    if (!node.expandable) {
      this.selectedNodeId = node.id; // Guarda el ID del nodo seleccionado
    }
  }

  // Tree control properties
  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.hijos && node.hijos.length > 0,
      nombre: node.nombre,
      nivel: node.nivel,
      id: node.id,
      level: level,
      configDir: node.configDir, // Añade esto
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.nivel,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.hijos
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  /**
   * Constructor
   */
  constructor(
    private _router: Router,
    private _loginService: LoginService,
    private _authService: AuthService,
    private _services: ServiceService,
    private _snackBar: MatSnackBar
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for current year
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  get formattedDate(): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    const weekdayNames = [
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
    ];
    const month = monthNames[date.getMonth()]; // Nombre del mes
    const year = date.getFullYear();
    const weekDay = weekdayNames[date.getDay()];

    return `${weekDay} ${day} de ${month} de ${year}`;
  }

  get userName(): string {
    return this._authService.formattedUserName;
  }

  get roleName(): string {
    return this._authService.userRole?.replace(/^./, (char) =>
      char.toUpperCase()
    );
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.obtenerTasas();
    this.loadMenu();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  loadMenu(): void {
    this._services
      .getMenu()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          // Filtrar solo los items habilitados y sus hijos habilitados
          this.menuItems = this.filterEnabledItems(response);
          this.dataSource.data = this.menuItems;
        },
        error: (err) => console.error("Error loading menu", err),
      });
  }

  jornadaActiva(): void {
    this.isLoading = true;
    this._services
      .consultaJornadaActiva()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (jornada) => {
          // console.log('Jornada activa:', jornada);
        },
        error: (err) => {
          console.error("Error al cargar la jornada activa:", err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  // Método para expandir/colapsar nodos
  toggleNode(node: ExampleFlatNode): void {
    this.treeControl.isExpanded(node)
      ? this.treeControl.collapse(node)
      : this.treeControl.expand(node);
  }

  setActiveNode(event: Event): void {
    // Elimina la clase 'active' de cualquier nodo previamente seleccionado
    const previouslyActive = document.querySelector("li.active");
    if (previouslyActive) {
      previouslyActive.classList.remove("active");
    }

    // Agrega la clase 'active' al nodo actual
    const target = event.currentTarget as HTMLElement;
    target.classList.add("active");
  }

  private filterEnabledItems(items: MenuNode[]): MenuNode[] {
    return items
      .filter((item) => item.habilitado)
      .map((item) => ({
        ...item,
        hijos: item.hijos ? this.filterEnabledItems(item.hijos) : [],
      }));
  }

  navigateTo(node: ExampleFlatNode): void {
    if (node.id === 5659) {
        // Nodo "Salir"
        this.signOut();
        return;
    }

    if (!node.configDir) {
        console.warn("El ítem del menú no tiene configDir definido");
        return;
    }

    const targetRoute = `/${node.configDir}`;

    if (this._router.url === targetRoute) {
        console.log(`Ya estás en la ruta: ${targetRoute}`);
        this.opened = false;
        this.isSidebarOpened = false; // Cierra el sidebar
        return;
    }

    switch (node.id) {
        case 5593: // Jornada Activa
            this.isLoading = true;
            this.opened = false;
            this._services.consultaJornadaActiva().subscribe({
                next: (jornada) => {
                    console.log("Datos precargados para Jornada Activa:", jornada);
                    this._services.jornadaActivaSource.next(jornada);
                    this._router.navigate([node.configDir]).then(() => {
                        this.isLoading = false;
                    });
                },
                error: (err) => {
                    console.error("Error al precargar datos para Jornada Activa:", err);
                    this.isLoading = false;
                    this._snackBar.open(
                        "No se ha podido consultar la jornada en este momento. Por favor, inténtalo más tarde.",
                        "Cerrar",
                        {
                            duration: 5000,
                            horizontalPosition: "right",
                            verticalPosition: "bottom",
                        }
                    );
                },
            });
            break;

        case 5673: // Sustituciones Pendientes
            this.isLoading = true;
            this.opened = false;
            this._services.consultaJornadaActiva().subscribe({
                next: (jornada) => {
                    console.log("Datos precargados para Jornada Activa:", jornada);
                    this._services.jornadaActivaSource.next(jornada);
                    this._router.navigate([node.configDir]).then(() => {
                        this.isLoading = false;
                    });
                },
                error: (err) => {
                    console.error("Error al precargar datos para Jornada Activa:", err);
                    this.isLoading = false;
                    this._snackBar.open(
                        "No se ha podido consultar la jornada en este momento. Por favor, inténtalo más tarde.",
                        "Cerrar",
                        {
                            duration: 5000,
                            horizontalPosition: "right",
                            verticalPosition: "bottom",
                        }
                    );
                },
            });
            break;

        default:
            this.isLoading = true;
            this._router
                .navigate([node.configDir])
                .then(() => {
                    this.opened = false;
                    this.isLoading = false;
                })
                .catch((error) => {
                    console.error("Error inesperado al navegar:", error);
                });
            break;
    }
}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  obtenerTasas(): void {
    this.loadingTasas = true;
    this.errorTasas = "";
    this.tasas = null;

    this._services
      .consultarTasas()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (tasas) => {
          this.tasas = tasas;
          this.loadingTasas = false;
        },
        error: (err) => {
          this.tasas = null;
          this.loadingTasas = false;
          console.error("Error al cargar tasas:", err);
        },
      });
  }

  /**
   * Toggle navigation
   *
   * @param name
   */
  toggleSidebar(): void {
    this.isSidebarOpened = !this.isSidebarOpened;
  }

  // Método de logout mejorado
  signOut(): void {
    // Verificar autenticación
    // const isAuthenticated = this._authService.authenticated;
    // console.log('Estado autenticación:', isAuthenticated);
    this._authService
      .signOut()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          // console.log('Logout backend exitoso:', response);
          this._router.navigate(["/sign-in"]).then(() => {
            this.opened = false;
            // console.log(success ? 'Redirección exitosa' : 'Redirección fallida');
          });
        },
        error: (err) => {
          console.error("Error en logout:", err);
          this._router.navigate(["/sign-in"]).then(() => {
            this.opened = false; 
          });
        },
      });
  }

  inicio(): void {
    this._router.navigate(["/menu-principal"]);
    this.opened = false;
    this.isLoading = true;
    this.events.push("close!");
    this.selectedNodeId = null;
    this.treeControl.collapseAll();
  }
}
