/**
 * Componente de inicio de sesión (Sign In) para la aplicación.
 * 
 * Este componente gestiona el formulario de autenticación de usuarios,
 * mostrando mensajes de error personalizados según la respuesta del backend,
 * y maneja la navegación tras un login exitoso.
 * 
 * Funcionalidades principales:
 * - Renderiza y valida el formulario de login.
 * - Envía las credenciales al backend y procesa la respuesta.
 * - Muestra mensajes de error amigables y específicos según el caso.
 * - Aplica estilos personalizados al fondo de la página de login.
 * 
 * Dependencias:
 * - Angular Forms y Router para la gestión de formularios y navegación.
 * - Servicios de autenticación y login.
 * - Fuse para animaciones y alertas visuales.
 */
import { Component, OnInit, Renderer2, ViewChild, ViewEncapsulation, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { LoginService } from 'app/services/login.service';

/**
 * Lista de mensajes que identifican errores de credenciales inválidas.
 * Si el mensaje de error recibido contiene alguno de estos textos,
 * se mostrará un mensaje genérico de "Credenciales incorrectas".
 */
const ERRORES_CREDENCIALES: string[] = [
    'Usuario no encontrado en SEPA',
    'Credenciales inválidas',
    'Usuario o contraseña incorrectos',
    'Invalid credentials',
    'Usuario no está activo en SEPA'
];

/**
 * Diccionario de mensajes de error específicos enviados por el backend,
 * mapeados a mensajes amigables para mostrar al usuario.
 * La clave es una parte del mensaje recibido y el valor es el mensaje a mostrar.
 */
const MENSAJES_ESPECIFICOS: Record<string, string> = {
    '(FWRK-SEC-0001)': 'El Usuario ya se encuentra autenticado en otra sesión.',
    'Usuario no tiene roles asignados para la aplicación INFI': 'No tienes permisos para acceder al sistema.'
};

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = { type: 'success', message: '' };
    signInForm: FormGroup;
    showAlert = false;

    constructor(
        private _formBuilder: FormBuilder,
        private _router: Router,
        private loginService: LoginService,
        private renderer: Renderer2,
    ) {
        // Configura el estilo del fondo de la página de login
        renderer.setStyle(document.body, 'overflow', 'hidden');
        renderer.setStyle(document.body, 'background', '#ededed');
        renderer.setStyle(document.body, 'background-image', 'url(assets/images/login/fondo_inicio.webp)');
        renderer.setStyle(document.body, 'background-position', 'center center');
        renderer.setStyle(document.body, 'background-size', 'cover');
        renderer.setStyle(document.body, 'background-repeat', 'no-repeat');
        renderer.setStyle(document.body, 'height', '100vh');
    }

    /**
     * Inicializa el formulario reactivo de login.
     */
    ngOnInit(): void {
        this.signInForm = this._formBuilder.group({
            usuario: ['', [Validators.required]],
            password: ['', Validators.required],
            rememberMe: ['']
        });
    }
me
    /**
     * Maneja el envío del formulario de login.
     * @param event Evento de envío del formulario
     */
    signIn(event: Event): void {
        if (this.signInForm.invalid) return;

        this.signInForm.disable();
        this.showAlert = false;

        const { usuario: codUsuario, password: password } = this.signInForm.value;

        const loginPayload = {
            codUsuario,
            password,
            siglasApplic: 'NOTINFI' //Descomentar para trabajar en gateway
        }

        this.loginService.validarUsuario(loginPayload).subscribe({
            next: (response: any) => {
                if (response && response.token) {
                    this._router.navigateByUrl('/menu-principal');
                } else {
                    this.mostrarError('Credenciales incorrectas');
                    this.signInForm.enable();
                }
            },
            error: (error: any) => {
                // Desempaqueta recursivamente si el error es función
                while (typeof error === 'function') {
                    error = error();
                }
                let errorMessage = this.extraerMensajeError(error);

                if (this.esErrorDeCredenciales(errorMessage)) {
                    errorMessage = 'Credenciales incorrectas';
                } else {
                let encontrado = false;
                for (const [key, value] of Object.entries(MENSAJES_ESPECIFICOS)) {
                    if (errorMessage.includes(key)) {
                        errorMessage = value;
                        encontrado = true;
                        break;
                    }
                }
                // Si no es ninguno de los predeterminados, mensaje genérico
                if (!encontrado) {
                    errorMessage = 'Error en el servidor';
                }
            }

    this.mostrarError(errorMessage);
    this.signInForm.enable();
}
        });
    }

    /**
     * Determina si el mensaje corresponde a un error de credenciales.
     * @param mensaje Mensaje de error recibido
     * @returns true si es un error de credenciales, false en caso contrario
     */
    private esErrorDeCredenciales(mensaje: string): boolean {
        return ERRORES_CREDENCIALES.some(error => mensaje.includes(error));
    }

    /**
     * Extrae el mensaje de error relevante del objeto de error recibido.
     * @param error Objeto de error recibido
     * @returns Mensaje de error extraído
     */
    private extraerMensajeError(error: any): string {
        if (typeof error === 'string') return error;
        if (error?.error?.mensaje) return error.error.mensaje;
        if (error?.message) return error.message;
        if (typeof error?.error === 'string') return error.error;
        return 'Error en el servidor';
    }

    /**
     * Mapea mensajes de error específicos a mensajes amigables para el usuario.
     * @param mensaje Mensaje de error recibido
     * @returns Mensaje amigable para mostrar al usuario
     */
    private mapearMensajesError(mensaje: string): string {
        for (const [key, value] of Object.entries(MENSAJES_ESPECIFICOS)) {
            if (mensaje.includes(key)) {
                return value;
            }
        }
        return mensaje || 'Error en el servidor';
    }

    /**
     * Muestra un mensaje de error en la alerta de la UI.
     * @param mensaje Mensaje a mostrar
     */
    private mostrarError(mensaje: string): void {
        this.alert = { type: 'error', message: mensaje };
        this.showAlert = true;

        setTimeout(() => {
            const alertElement = document.querySelector('fuse-alert');
            if (alertElement) {
                alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }

    /**
     * Indica si el formulario es válido y tiene valores.
     */
    get isValid() {
        return this.signInForm.valid && this.signInForm.value;
    }
    
}