import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { login, loginLdap } from 'app/models/login';
import { HmacSHA256 } from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import { environment } from 'environments/environment';
import { jwtDecode } from 'jwt-decode';
import { cloneDeep } from 'lodash-es';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  urlEndPoint: string = '';
  private readonly _secret: any;
  constructor(private http : HttpClient) { 
    this.urlEndPoint = environment.urlEndPoint;
    this._secret = 'YOUR_VERY_CONFIDENTIAL_SECRET_FOR_SIGNING_JWT_TOKENS!!!';
  }

  obterTokenInfo(){
    const decode = jwtDecode(sessionStorage.getItem('accessToken'));
    return decode;
  }

  iniciarToken(usuario : any){
    return this._generateJWTToken(usuario);
  }

  capturarInfo(token : any){
    console.log(this._verifyJWTToken(token));
  }

  validarUsuario(codUsuario : string, clave : string): Observable<any>{
    const url = this.urlEndPoint + 'ldapWS/validarCredenciales';
    const usuario = {
      codUsuario: codUsuario,
      clave: clave
    }
    return this.http.post<loginLdap>(url, usuario);
  }

  usuario(cedula: string): Observable<any> {
    const envio = {
      cedula,
    };
    const url = this.urlEndPoint + 'ldapWS/obtenerUsuario';
    const jsonEnvio = JSON.stringify(envio);
    return this.http.post<loginLdap>(url, jsonEnvio);
  }

  obtenerMenu(cedula : any): Observable<any>{
    const busqueda = {
      cedula: cedula,
      app: 'ASI'
    };
    const url = this.urlEndPoint + 'int-servicios/obtenerMenu';
    return this.http.post(url, busqueda);
  }




    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Return base64 encoded version of the given string
     *
     * @param source
     * @private
     */
    private _base64url(source: any): string
    {
        // Encode in classical base64
        let encodedSource = Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        // Return the base64 encoded string
        return encodedSource;
    }

    /**
     * Generates a JWT token using CryptoJS library.
     *
     * This generator is for mocking purposes only and it is NOT
     * safe to use it in production frontend applications!
     *
     * @private
     */
    private _generateJWTToken(usuario :any): string
    {
        // Define token header
        const header = {
            alg: 'HS256',
            typ: 'JWT'
        };

        // Calculate the issued at and expiration dates
        const date = new Date();
        const iat = Math.floor(date.getTime() / 1000);
        const exp = Math.floor((date.setDate(date.getDate() + 7)) / 1000);

        // Define token payload
        const payload = {
            iat: iat,
            iss: 'Fuse',
            exp: exp
        };

        // Stringify and encode the header
        const stringifiedHeader = Utf8.parse(JSON.stringify(header));
        const encodedHeader = this._base64url(stringifiedHeader);

        // Stringify and encode the payload
        const stringifiedPayload = Utf8.parse(JSON.stringify(usuario));
        const encodedPayload = this._base64url(stringifiedPayload);

        // Sign the encoded header and mock-api
        let signature: any = encodedHeader + '.' + encodedPayload;
        signature = HmacSHA256(signature, this._secret);
        signature = this._base64url(signature);

        // Build and return the token
        return encodedHeader + '.' + encodedPayload + '.' + signature;
    }

    /**
     * Verify the given token
     *
     * @param token
     * @private
     */
    private _verifyJWTToken(token: string): boolean
    {
        // Split the token into parts
        const parts = token.split('.');
        console.log('user token');
        console.log(parts);
        const header = parts[0];
        const payload = parts[1];
        const signature = parts[2];

        // Re-sign and encode the header and payload using the secret
        const signatureCheck = this._base64url(HmacSHA256(header + '.' + payload, this._secret));

        // Verify that the resulting signature is valid
        return (signature === signatureCheck);
    }
}
