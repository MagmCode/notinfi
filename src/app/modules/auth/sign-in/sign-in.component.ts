import { Component, OnInit, Renderer2, ViewChild, ViewEncapsulation, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { loginLdap } from 'app/models/login';
import { LoginService } from 'app/services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AuthSignInComponent implements OnInit {
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private renderer: Renderer2,
        private loginService: LoginService,
        private ngZone: NgZone,
    ) {
        // Configura el estilo del fondo
        renderer.setStyle(document.body, 'overflow', 'hidden');
        renderer.setStyle(document.body, 'background', '#ededed');
        renderer.setStyle(document.body, 'background-image', 'url(assets/images/login/fondo_inicio.webp)');
        renderer.setStyle(document.body, 'background-position', 'center center');
        renderer.setStyle(document.body, 'background-size', 'cover');
        renderer.setStyle(document.body, 'background-repeat', 'no-repeat');
        renderer.setStyle(document.body, 'height', '100vh');
    }

    ngOnInit(): void {
        // Crea el formulario reactivo
        this.signInForm = this._formBuilder.group({
            usuario: ['', [Validators.required]],
            password: ['', Validators.required],
            rememberMe: ['']
        });
    }

    signIn(event: Event): void {
        if (this.signInForm.invalid) {
            return;
        }
    
        this.signInForm.disable();
        this.showAlert = false;
    
        const { usuario: codUsuario, password: clave } = this.signInForm.value;
    
        this.loginService.validarUsuario(codUsuario, clave).subscribe({
            // next: (response: loginLdap) => {
            //     if (response?.estatus?.toUpperCase() === 'SUCCESS') {
            next: (response: any) => {
                // Ahora la respuesta exitosa tiene un token
                if (response && response.token) {
                    this._router.navigateByUrl('/menu-principal');
                } else {
                    // Mensaje genérico para cualquier fallo de autenticación
                    this.mostrarError('Credenciales incorrectas');
                    this.signInForm.enable();
                }
            },
            error: (error: any) => {
                let errorMessage = this.extraerMensajeError(error);
                
                // Mapear todos los errores relacionados con credenciales a un mensaje genérico
                if (this.esErrorDeCredenciales(errorMessage)) {
                    errorMessage = 'Credenciales incorrectas';
                } else {
                    errorMessage = this.mapearMensajesError(errorMessage);
                }
                
                this.mostrarError(errorMessage);
                this.signInForm.enable();
            }
        });
    }
    
    private esErrorDeCredenciales(mensaje: string): boolean {
        const erroresCredenciales = [
            'Usuario no encontrado en SEPA',
            'Credenciales inválidas',
            'Usuario o contraseña incorrectos',
            'Invalid credentials',
            'Usuario no está activo en SEPA'
        ];
    
        return erroresCredenciales.some(error => mensaje.includes(error));
    }
    
    private extraerMensajeError(error: any): string {
        if (typeof error === 'string') return error;
        if (error?.error?.mensaje) return error.error.mensaje;
        if (error?.message) return error.message;
        if (typeof error?.error === 'string') return error.error;
        return 'Error en el servidor';
    }
    
    private mapearMensajesError(mensaje: string): string {
        // Mantener solo mensajes que NO sean de credenciales
        const mensajesEspecificos = {
            '(FWRK-SEC-0001)': 'El usuario ya tiene una sesión activa.',
            'Usuario no tiene roles asignados para la aplicación INFI': 'No tienes permisos para acceder al sistema.'
        };
    
        for (const [key, value] of Object.entries(mensajesEspecificos)) {
            if (mensaje.includes(key)) {
                return value;
            }
        }
    
        return 'Error en el servidor';
    }
  
  private mostrarError(mensaje: string): void {
    //   console.log('Mostrando error:', mensaje); // Para depuración   
      this.alert = {
          type: 'error',
          message: mensaje
      };
      this.showAlert = true;
      
      setTimeout(() => {
          const alertElement = document.querySelector('fuse-alert');
          if (alertElement) {
              alertElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
      }, 100);
  }
    get isValid() {
        return this.signInForm.valid && this.signInForm.value;
    }
}