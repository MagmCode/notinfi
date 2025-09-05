/**
 * intervencion.module.ts
 * Módulo principal para las funcionalidades de intervención.
 * Importa y declara todos los componentes, módulos y servicios necesarios para las operaciones de intervención.
 * Configura Angular Material, adaptadores de fecha y formatos personalizados.
*/

import { NgModule } from '@angular/core';
import { IntervencionRoutingModule } from './intervencion.routing';
import { SharedModule } from 'app/shared/shared.module';
import { UserModule } from 'app/layout/common/user/user.module';

// Componentes de intervención
import { CambioClaveIntervencionComponent } from './cambio-clave-intervencion/cambio-clave-intervencion.component';
import { AnulacionIntervencionComponent } from './anulacion-intervencion/anulacion-intervencion.component';
import { CargaIntervencionComponent } from './carga-intervencion/carga-intervencion.component';
import { ConsultabcvIntervencionComponent } from './consultabcv-intervencion/consultabcv-intervencion.component';
import { InterbancarioIntervencionComponent } from './interbancario-intervencion/interbancario-intervencion.component';
import { JornadaIntervencionComponent } from './jornada-intervencion/jornada-intervencion.component';
import { OperacionesIntervencionComponent } from './operaciones-intervencion/operaciones-intervencion.component';
import { EditOperacionesIntervencionModalComponent } from './operaciones-intervencion/edit-operaciones-intervencion-modal/edit-operaciones-intervencion-modal.component';
import { SustitucionesPendientesComponent } from './sustituciones-pendientes/sustituciones-pendientes.component';
import { SustitucionOperacionesComponent } from './sustitucion-operaciones/sustitucion-operaciones.component';
import { ConsultaDefinitivaBcvComponent } from './consulta-definitiva-bcv/consulta-definitiva-bcv.component';

@NgModule({
  declarations: [
    // Componentes principales de intervención
    CambioClaveIntervencionComponent,
    AnulacionIntervencionComponent,
    CargaIntervencionComponent,
    ConsultabcvIntervencionComponent,
    InterbancarioIntervencionComponent,
    JornadaIntervencionComponent,
    OperacionesIntervencionComponent,
    EditOperacionesIntervencionModalComponent,
    SustitucionesPendientesComponent,
    SustitucionOperacionesComponent,
    ConsultaDefinitivaBcvComponent
  ],
  imports: [
    IntervencionRoutingModule,
    SharedModule,
    UserModule,
  ]
})
export class IntervencionModule { }