import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from 'environments/environment';
import { AppModule } from 'app/app.module';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs, 'es'); // Registrar el locale español

if ( environment.production )
{
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
                        .catch(err => console.error(err));
