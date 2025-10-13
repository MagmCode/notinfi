import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { loginLdap } from 'app/models/login'; // Ajusta la ruta según tu proyecto
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private urlEndPoint: string = environment.urlEndPoint2;

  constructor(private http: HttpClient) {}

  /**
   * Valida las credenciales del usuario contra el backend.
   * Si la respuesta incluye un token, lo almacena en localStorage.
   * En caso de error, lo propaga para que el componente lo maneje.
   *
   * @param codUsuario - Identificador del usuario.
   * @param clave - Contraseña del usuario.
   * @returns Observable<loginLdap> con la respuesta del backend.
   */

  //Descomentar para trabajar en gateway
  // 
  // validarUsuario(data: { codUsuario: string, siglasApplic: string }): Observable<any> {
  
  //   return this.http.post<any>(`${this.urlEndPoint}api/auth/login`, data).pipe(
  //     tap((response: any) => {
  //       // console.log('Respuesta completa del backend:', response);
  //       if (response.token) {
  //         localStorage.setItem('token', response.token);
  //         // Ahora los datos vienen directamente en el response
  //         localStorage.setItem('user', JSON.stringify({
  //           codUsuario: response.codUsuario, 
  //           userId: response.codUsuario, // No hay userId, se usa codUsuario
  //           fullName: response.nombreCompleto, // Cambió el nombre del campo
  //           roleName: response.roleName,
  //           roleId: response.roleId,
  //         }));
  //         // console.log('Usuario almacenado en localStorage:', {
  //         //   codUsuario: response.codUsuario,
  //         //   userId: response.codUsuario,
  //         //   fullName: response.nombreCompleto,
  //         //   roleName: response.roleName,
  //         //   roleId: response.roleId,
  //         // });
  //       }
  //     }),
  //     catchError((error: HttpErrorResponse) => {
  //       // console.log('LoginService - error recibido:', error);
  //        return throwError(() => error); // Lanza el error completo, no solo el mensaje
  //   })
  //   );
  // }

    validarUsuario(data: { codUsuario: string}): Observable<any> {
  
    return this.http.post<any>(`${this.urlEndPoint}api/auth/login`, data).pipe(
      tap((response: any) => {
        // console.log('Respuesta completa del backend:', response);
        if (response.token) {
          localStorage.setItem('token', response.token);
          // Ahora los datos vienen directamente en el response
          localStorage.setItem('user', JSON.stringify({
            codUsuario: response.codUsuario, 
            userId: response.codUsuario, // No hay userId, se usa codUsuario
            fullName: response.nombreCompleto, // Cambió el nombre del campo
            roleName: response.roleName,
            roleId: response.roleId,
          }));
          // console.log('Usuario almacenado en localStorage:', {
          //   codUsuario: response.codUsuario,
          //   userId: response.codUsuario,
          //   fullName: response.nombreCompleto,
          //   roleName: response.roleName,
          //   roleId: response.roleId,
          // });
        }
      }),
      catchError((error: HttpErrorResponse) => {
        // console.log('LoginService - error recibido:', error);
         return throwError(() => error); // Lanza el error completo, no solo el mensaje
    })
    );
  }


}
