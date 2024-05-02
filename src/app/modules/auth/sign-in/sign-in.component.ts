import { Component, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,        
        private renderer: Renderer2,
    )
    {
        renderer.setStyle(
            document.body,
            'overflow',
            'hidden',                  
          );
          renderer.setStyle(
            document.body,
            'background',
            '#ededed',                  
          );
            renderer.setStyle(
              document.body,
              'background-image',
              'url(assets/images/login/fondo_inicio.webp)' ,                  
            );

            renderer.setStyle(
              document.body,
              'background-position',
              'center center',                  
            );
            renderer.setStyle(
                document.body,
                'background-size',
                'cover',                  
              );

            renderer.setStyle(
              document.body,
              'background-repeat',
              'no-repeat',                  
            );
            renderer.setStyle(
                document.body,
                'height',
                '100vh',                  
              );
            
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required]],
            password  : ['', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe(
                (response) => {
                    if(response.status === 'success'){                
                     const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                     this._router.navigateByUrl(redirectURL);
                }else{
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: response.mensaje
                    };

                    // Show the alert
                    this.showAlert = true;
                }
                }
            );
    }
}
