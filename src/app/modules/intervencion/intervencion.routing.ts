import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CargaIntervencionComponent } from './carga-intervencion/carga-intervencion.component';
import { OperacionesIntervencionComponent } from './operaciones-intervencion/operaciones-intervencion.component';
import { InterbancarioIntervencionComponent } from './interbancario-intervencion/interbancario-intervencion.component';
import { CambioClaveIntervencionComponent } from './cambio-clave-intervencion/cambio-clave-intervencion.component';
import { AnulacionIntervencionComponent } from './anulacion-intervencion/anulacion-intervencion.component';
import { ConsultabcvIntervencionComponent } from './consultabcv-intervencion/consultabcv-intervencion.component';
import { JornadaIntervencionComponent } from './jornada-intervencion/jornada-intervencion.component';
import { SustitucionesPendientesComponent } from './sustituciones-pendientes/sustituciones-pendientes.component';
import { SustitucionOperacionesComponent } from './sustitucion-operaciones/sustitucion-operaciones.component';
import { ConsultaDefinitivaBcvComponent } from './consulta-definitiva-bcv/consulta-definitiva-bcv.component';

const routes: Routes = [
  { path: 'carga', component: CargaIntervencionComponent },
  { path: 'operaciones', component: OperacionesIntervencionComponent},
  { path: 'interbancario', component: InterbancarioIntervencionComponent},
  { path: 'cambio_clave', component: CambioClaveIntervencionComponent},
  { path: 'anulacion', component: AnulacionIntervencionComponent},
  { path: 'consulta_bcv', component: ConsultabcvIntervencionComponent},
  { path: 'consulta_jornada', component: JornadaIntervencionComponent},
  { path: 'sustituciones-pendientes', component: SustitucionesPendientesComponent},
  { path: 'sustitucion-operaciones', component: SustitucionOperacionesComponent},
  { path: 'consulta-definitiva-bcv', component: ConsultaDefinitivaBcvComponent},

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntervencionRoutingModule { }
