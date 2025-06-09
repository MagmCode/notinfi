import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { ServiceService } from "app/services/service.service";

/**
 * Componente principal del menú de la aplicación.
 * Muestra las tasas de cambio y gestiona la navegación principal.
 * Incluye lógica para cargar tasas desde el servicio y mostrar barra de carga.
 */
@Component({
  selector: "menu-principal",
  templateUrl: "./menu-principal.component.html",
  styleUrls: ["./menu-principal.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class MenuPrincipalComponent implements OnInit, OnDestroy {

  /**
   * Subject para manejar la destrucción de suscripciones y evitar fugas de memoria.
   */
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Indica si se está mostrando la barra de carga.
   */
  isLoading: boolean = false;

  /**
   * Objeto con las tasas de cambio actuales.
   * Si es null, indica que aún no se han cargado.
   */
  tasas: {
    compraUsd: string;
    compraEur: string;
    compraPTR: string;
    compraCNY: string;
    compraTRY: string;
    compraRUB: string;
  } | null = null;

  /**
   * Indica si se están cargando las tasas.
   */
  loadingTasas = false;

  /**
   * Mensaje de error en caso de fallo al cargar tasas.
   */
  errorTasas = "";

  /**
   * Constructor del componente.
   * @param _router Servicio de rutas de Angular.
   * @param _service Servicio principal de la aplicación para obtener datos.
   */
  constructor(
    private _router: Router,
    private _service: ServiceService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Devuelve el año actual.
   * Útil para mostrar en el pie de página o encabezados.
   */
  get currentYear(): number {
    return new Date().getFullYear();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * Hook de inicialización del componente.
   * Llama a la función para obtener las tasas de cambio al cargar el componente.
   */
  ngOnInit(): void {
    this.obtenerTasas();
  }

  /**
   * Hook de destrucción del componente.
   * Libera todas las suscripciones activas para evitar memory leaks.
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Métodos de negocio
  // -----------------------------------------------------------------------------------------------------

  /**
   * Obtiene las tasas de cambio desde el servicio.
   * Si ya existen tasas precargadas, las usa; si no, realiza la consulta al backend.
   * Maneja el estado de carga y posibles errores.
   */
  obtenerTasas(): void {
    this.isLoading = true;

    this._service.tasas$.subscribe({
      next: (tasas) => {
        if (!tasas) {
          // Si no hay tasas precargadas, consulta al backend
          this._service.consultarTasas().subscribe({
            next: (tasas) => {
              console.log("Tasas obtenidas:", tasas);
              this.tasas = tasas;
              setTimeout(() => {
                this.isLoading = false;
              }, 500); // Pequeño delay para mejor UX
            },
            error: (err) => {
              console.error("Error al obtener tasas:", err);
              this.isLoading = false;
            },
          });
        } else {
          // Si ya hay tasas en memoria, las usa directamente
          console.log("Tasas precargadas:", tasas);
          this.tasas = tasas;
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        }
      },
      error: (err) => {
        console.error("Error al cargar tasas:", err);
        this.isLoading = false;
      },
    });
  }
}