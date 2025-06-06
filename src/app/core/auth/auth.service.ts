import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated: boolean = false;
  private apiUrl = environment.urlEndPoint;

  constructor(
    private _http: HttpClient, 
    private _router: Router
  ) {}


  /**
   * Obtiene los datos del usuario desde localStorage
   */
  get currentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  get userFullName(): string {
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  // console.log('Datos recuperados de localStorage:', userData); // Debug
  return userData?.fullName || 'Usuario';
}

get formattedUserName(): string {
  const fullName = this.userFullName?.trim() || '';
  
  if (!fullName) return 'Usuario';

  // Dividir el nombre completo en partes y eliminar espacios vacíos
  const nameParts = fullName.split(/\s+/).filter(part => part.length > 0);

  // Caso 1: Nombre muy corto
  if (nameParts.length === 1) return nameParts[0];
  
  // Caso 2: Nombre + 1 apellido
  if (nameParts.length === 2) return fullName;
  
  // Caso 3: Nombre compuesto + apellidos
  const firstName = nameParts[0]; // Alexander
  const firstSurname = nameParts[nameParts.length - 2]; 
  
  return `${firstName} ${firstSurname}`;
}
  /**
   * Obtiene el rol del usuario
   */
  get userRole(): string {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    // console.log('Datos recuperados de localStorage:', userData); // Debug
    return userData?.roleName || 'Usuario';
    }
  // Propiedad para verificar estado de autenticación
  get authenticated(): boolean {
    return this._authenticated || !!localStorage.getItem('token');
  }
  // Método para establecer autenticación
  setAuthenticated(value: boolean): void {
    this._authenticated = value;
    localStorage.setItem('isAuthenticated', value.toString());
  }

  /**
   * Cierra la sesión en el backend y limpia los datos locales
   */
  signOut(): Observable<any> {
    // console.group('[AuthService] Proceso de logout');
    
    const token = localStorage.getItem('token');
    const userData = this.currentUser; // Guardar datos antes de limpiar
    
    this._clearAuthData(false);
    
    if (!token) {
      // console.warn('No se encontró token - Solo limpieza local');
      // console.groupEnd();
      return of({ status: 'WARNING', message: 'No había sesión activa' });
    }

    // console.log('Enviando petición de logout al backend...');
    
    return this._http.post(`${this.apiUrl}api/auth/logout`, {}, {
    // return this._http.post(`${this.apiUrl}logout`, {}, {
      headers: new HttpHeaders({
        // 'Authorization': `Bearer ${token}`
        'Authorization': token // Descomentar cuando se actualice el back
      })
    }).pipe(
      tap((response: any) => {
        // console.log('Respuesta del backend:', response);
        this._clearAuthData(true);
        
        // Opcional: Registrar datos del usuario que cerró sesión
        // console.log(`Usuario desconectado: ${userData?.fullName || 'Desconocido'}`);
      }),
      catchError(error => {
        // console.error('Error en logout:', error);
        this._clearAuthData(true);
        return throwError(() => ({
          status: 'ERROR',
          message: 'Error al cerrar sesión',
          error: error
        }));
      }),
      finalize(() => {
        // console.log('Proceso de logout completado');
        // console.groupEnd();
      })
    );
  }

  /**
   * Limpia los datos de autenticación local
   * @param complete - Si true, elimina también el token
   */
  private _clearAuthData(complete: boolean): void {
    // console.log('[AuthService] Limpiando datos de autenticación...');
    
    // Items a eliminar
    const itemsToRemove = ['isAuthenticated', 'user'];
    
    if (complete) {
      itemsToRemove.push('token');
    }
    
    itemsToRemove.forEach(item => localStorage.removeItem(item));
    
    // Resetear estado
    this._authenticated = false;
    
    // Redirigir si es limpieza completa
    if (complete) {
      this._router.navigate(['/sign-in']);
    }
  }
}