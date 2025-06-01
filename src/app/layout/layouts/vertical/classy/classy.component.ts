// #region Imports
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FuseNavigationItem } from "@fuse/components/navigation";
import { Navigation } from "app/core/navigation/navigation.types";
import { User } from "app/core/user/user.types";
import { LoginService } from "app/services/login.service";
import { AuthService } from "app/core/auth/auth.service";
import { ServiceService } from "app/services/service.service";
import { MenuNode, ExampleFlatNode } from "app/models/menu";
import { FlatTreeControl } from "@angular/cdk/tree";
import { MatTreeFlatDataSource, MatTreeFlattener } from "@angular/material/tree";
import { MatSnackBar } from "@angular/material/snack-bar";
// #endregion

/**
 * Componente principal del layout vertical "Classy".
 * Gestiona la barra lateral, navegación dinámica, usuario, tasas y layout general.
 * 
 * Estructura:
 * - Sidebar lateral con menú dinámico y perfil de usuario.
 * - Header superior con logo, título y fecha.
 * - Contenido principal (router-outlet).
 * - Footer fijo con información institucional.
 */
@Component({
  selector: "classy-layout",
  templateUrl: "./classy.component.html",
  styleUrls: ["./classy.component.scss"],
  // encapsulation: ViewEncapsulation.None
})
export class ClassyLayoutComponent implements OnDestroy, OnInit {
  //#region Variables

  // /** Indica si la pantalla es pequeña (responsive). No se usa actualmente. */
  // isScreenSmall: boolean;

  // /** Estructura de navegación principal. No se usa actualmente. */
  // navigation: Navigation;

  // /** Información del usuario autenticado. No se usa directamente. */
  // user = {} as User;

  /** Subject para cancelar subscripciones al destruir el componente */
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  // /** Datos del menú de navegación. No se usa directamente. */
  // menuData: FuseNavigationItem[];

  // /** Información adicional del usuario. No se usa directamente. */
  // usuario = {} as any;

  // /** Estado de apertura del sidebar (no usado, sólo para lógica extra) */
  // isSidebarOpened = false;

  /** Estado de apertura del sidenav (Angular Material) */
  opened: boolean;

  /** Lista de eventos del sidenav (para debug o tracking visual) */
  events: string[] = [];

  /** Indica si se está cargando información global (muestra barra de carga) */
  isLoading: boolean = false;

  /** Indica si la pantalla es pequeña (para lógica adicional, sólo se evalúa al cargar) */
  ifScreenSmall = window.innerWidth < 768;

  // /** Tasas de cambio consultadas (USD/EUR) */
  // tasas: { compraUsd: string; compraEur: string } | null = null;

  // /** Estado de carga de tasas */
  // loadingTasas = false;

  // /** Mensaje de error al consultar tasas */
  // errorTasas = "";

  /** Estructura de nodos del menú lateral */
  menuItems: MenuNode[] = [];

  /** ID del nodo seleccionado en el menú lateral */
  selectedNodeId: number | null = null;

  //#endregion

  //#region Árbol de menú lateral

  /**
   * Marca el nodo como seleccionado visualmente.
   * @param node Nodo seleccionado.
   */
  selectNode(node: ExampleFlatNode): void {
    if (!node.expandable) {
      this.selectedNodeId = node.id;
    }
  }

  /** Función de transformación para el árbol de menú lateral */
  private _transformer = (node: MenuNode, level: number) => {
    return {
      expandable: !!node.hijos && node.hijos.length > 0,
      nombre: node.nombre,
      nivel: node.nivel,
      id: node.id,
      level: level,
      configDir: node.configDir,
    };
  };

  /** Controlador del árbol de menú lateral */
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.nivel,
    (node) => node.expandable
  );

  /** Flattener para transformar nodos anidados en nodos planos */
  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.hijos
  );

  /** Fuente de datos del árbol de menú lateral */
  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  /** Determina si un nodo tiene hijos */
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  //#endregion

  /**
   * Constructor del componente.
   * @param _router Servicio de rutas de Angular.
   * @param _loginService Servicio de login. (No se usa directamente)
   * @param _authService Servicio de autenticación.
   * @param _services Servicio general de la aplicación.
   * @param _snackBar Servicio para mostrar notificaciones.
   */
  constructor(
    private _router: Router,
    private _loginService: LoginService, // No se usa directamente
    private _authService: AuthService,
    private _services: ServiceService,
    private _snackBar: MatSnackBar
  ) {}

  //#region Accessors

  /** Año actual para mostrar en el footer */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  /** Fecha formateada para mostrar en el header */
  get formattedDate(): string {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const monthNames = [
      "enero", "febrero", "marzo", "abril", "mayo", "junio",
      "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];
    const weekdayNames = [
      "Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const weekDay = weekdayNames[date.getDay()];
    return `${weekDay} ${day} de ${month} de ${year}`;
  }

  /** Nombre del usuario autenticado (obtenido del AuthService) */
  get userName(): string {
    return this._authService.formattedUserName;
  }

  /** Rol del usuario autenticado (capitalizado) */
  get roleName(): string {
    return this._authService.userRole?.replace(/^./, (char) =>
      char.toUpperCase()
    );
  }

  //#endregion

  //#region Ciclo de vida

  /**
   * Inicializa el componente: consulta tasas y carga menú lateral.
   */
  ngOnInit(): void {
    // this.obtenerTasas();
    this.loadMenu();
  }

  /**
   * Cancela todas las subscripciones al destruir el componente.
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  //#endregion

  //#region Menú lateral y navegación

  /**
   * Carga el menú lateral desde el backend y filtra los ítems habilitados.
   */
  loadMenu(): void {
    this._services
      .getMenu()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (response) => {
          this.menuItems = this.filterEnabledItems(response);
          this.dataSource.data = this.menuItems;
        },
        error: (err) => console.error("Error loading menu", err),
      });
  }

  /**
   * Consulta la jornada activa (usado en algunos accesos directos del menú).
   * No se utiliza directamente en la plantilla.
   */
  jornadaActiva(): void {
    this.isLoading = true;
    this._services
      .consultaJornadaActiva()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: (jornada) => {
          // Datos de jornada activa disponibles aquí si se requieren
        },
        error: (err) => {
          console.error("Error al cargar la jornada activa:", err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  /**
   * Expande o colapsa un nodo del menú lateral.
   * @param node Nodo a expandir/colapsar.
   */
  toggleNode(node: ExampleFlatNode): void {
    this.treeControl.isExpanded(node)
      ? this.treeControl.collapse(node)
      : this.treeControl.expand(node);
  }

  /**
   * Marca visualmente el nodo activo en el menú lateral.
   * No se utiliza en la plantilla.
   * @param event Evento de click.
   */
  setActiveNode(event: Event): void {
    const previouslyActive = document.querySelector("li.active");
    if (previouslyActive) {
      previouslyActive.classList.remove("active");
    }
    const target = event.currentTarget as HTMLElement;
    target.classList.add("active");
  }

  /**
   * Filtra recursivamente los ítems habilitados del menú.
   * @param items Lista de nodos del menú.
   */
  private filterEnabledItems(items: MenuNode[]): MenuNode[] {
    return items
      .filter((item) => item.habilitado)
      .map((item) => ({
        ...item,
        hijos: item.hijos ? this.filterEnabledItems(item.hijos) : [],
      }));
  }

  /**
   * Navega a la ruta asociada al nodo seleccionado del menú.
   * Si el nodo es "Salir", ejecuta logout.
   * Si requiere precarga de datos, consulta primero.
   * @param node Nodo seleccionado.
   */
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
      this.opened = false;
      // this.isSidebarOpened = false;
      return;
    }

    switch (node.id) {
      case 5593: // Jornada Activa
      case 5673: // Sustituciones Pendientes
        this.isLoading = true;
        this.opened = false;
        this._services.consultaJornadaActiva().subscribe({
          next: (jornada) => {
            this._services.jornadaActivaSource.next(jornada);
            this._router.navigate([node.configDir]).then(() => {
              this.isLoading = false;
            });
          },
          error: (err) => {
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

  //#endregion

  //#region Métodos públicos

  // /**
  //  * Consulta las tasas de cambio y actualiza el estado.
  //  */
  // obtenerTasas(): void {
  //   this.loadingTasas = true;
  //   this.errorTasas = "";
  //   this.tasas = null;

  //   this._services
  //     .consultarTasas()
  //     .pipe(takeUntil(this._unsubscribeAll))
  //     .subscribe({
  //       next: (tasas) => {
  //         this.tasas = tasas;
  //         this.loadingTasas = false;
  //       },
  //       error: (err) => {
  //         this.tasas = null;
  //         this.loadingTasas = false;
  //         console.error("Error al cargar tasas:", err);
  //       },
  //     });
  // }

  // /**
  //  * Alterna la visibilidad del sidebar lateral.
  //  * No se utiliza en la plantilla.
  //  */
  // toggleSidebar(): void {
  //   this.isSidebarOpened = !this.isSidebarOpened;
  // }

  /**
   * Cierra sesión y redirige al login.
   */
  signOut(): void {
    this._authService
      .signOut()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe({
        next: () => {
          this._router.navigate(["/sign-in"]).then(() => {
            this.opened = false;
          });
        },
        error: (err) => {
          this._router.navigate(["/sign-in"]).then(() => {
            this.opened = false;
          });
        },
      });
  }

  /**
   * Navega al menú principal y resetea el estado del menú lateral.
   */
  inicio(): void {
    this._router.navigate(["/menu-principal"]);
    this.opened = false;
    this.isLoading = true;
    this.events.push("close!");
    this.selectedNodeId = null;
    this.treeControl.collapseAll();
  }

  //#endregion
}
// #endregion
