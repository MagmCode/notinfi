import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap, timeout } from 'rxjs/operators';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { LoginService } from 'app/services/login.service';
import { usuarioMenu } from 'app/models/login';

@Injectable()
export class AuthService
{
    private _authenticated: boolean = false;
    usuarioMenu !: usuarioMenu;
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private _loginService: LoginService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        sessionStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return sessionStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('Usuario se encuentra logeado');
        }

         return this._loginService.validarUsuario(credentials.email, credentials.password).pipe(
            switchMap((response: any) => {
                if(response.status == 'success'){
                    this.accessToken = this._loginService.iniciarToken(response.usuario);
                    this._authenticated = true;
                    const usu =
                    {
                        id    : '',
                        name  : response.usuario.apellidos + ' ' + response.usuario.nombres,
                        email : response.usuario.cargo,
                        avatar: 'assets/images/avatars/brian-hughes.jpg',
                        status: ''
                    }
                    this._userService.user = usu;

                }
                return of(response);    
            })
        );
        
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Renew token
        return of(true);
    }
    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage

        console.log("cerrando session")
        sessionStorage.removeItem('accessToken');
        sessionStorage.clear();

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        // if ( AuthUtils.isTokenExpired(this.accessToken) )
        // {
        //     return of(false);
        // }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
