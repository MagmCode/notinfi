// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { environment } from 'environments/environment';
// import { loginLdap } from 'app/models/login'; // Ajusta la ruta según tu proyecto
// import { tap, catchError } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class LoginService {
//   private urlEndPoint: string = environment.urlEndPoint;

//   constructor(private http: HttpClient) {}

//   /**
//    * Valida las credenciales del usuario contra el backend.
//    * Si la respuesta incluye un token, lo almacena en localStorage.
//    * En caso de error, lo propaga para que el componente lo maneje.
//    *
//    * @param codUsuario - Identificador del usuario.
//    * @param clave - Contraseña del usuario.
//    * @returns Observable<loginLdap> con la respuesta del backend.
//    */
//   validarUsuario(codUsuario: string, clave: string): Observable<any> {
//     // const url = `${this.urlEndPoint}login`;
//     const url = `${this.urlEndPoint}api/auth/login`;
//     const usuario = { codUsuario, clave };
  
//     return this.http.post<any>(url, usuario).pipe(
//       tap((response: any) => {

//         console.log('Respuesta completa del backend:', response);
        
//         if (response.token) {
//           localStorage.setItem('token', response.token);
          
//           // Acceder directamente a response.data (nueva estructura)
//           localStorage.setItem('user', JSON.stringify({
//             codUsuario: codUsuario, 
//             userId: response.data.userId, // Acceso directo
//             fullName: response.data.fullName, // Acceso directo
//             roleName: response.data.roleName,
//             roleId: response.data.roleId,
//           }));
//           console.log('Usuario almacenado en localStorage:', {
//             codUsuario: codUsuario,
//             userId: response.data.userId,
//             fullName: response.data.fullName,
//             roleName: response.data.roleName,
//             roleId: response.data.roleId,
//           });
//         }
//       }),
//       catchError((error: HttpErrorResponse) => {
//         const errorMessage = error.error?.mensaje || error.message || 'Error desconocido';
//         return throwError(errorMessage);
//       })
//     );
//   }

// }





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
  private urlEndPoint: string = environment.urlEndPoint;

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
  validarUsuario(codUsuario: string, clave: string): Observable<any> {
    const url = `${this.urlEndPoint}api/auth/login`;
    const usuario = { codUsuario};
  
    return this.http.post<any>(url, usuario).pipe(
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
