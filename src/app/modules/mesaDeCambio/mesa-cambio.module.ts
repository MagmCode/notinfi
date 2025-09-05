/**
 * mesa-cambio.module.ts
 * Módulo principal para las funcionalidades de mesa de cambio.
 * Importa y declara todos los componentes, módulos y servicios necesarios para las operaciones de mesa de cambio.
 * Configura Angular Material, adaptadores de fecha y formatos personalizados.
 */

import { NgModule } from '@angular/core';
import { MesaCambioRoutingModule } from './mesa-cambio.routing';
import { SharedModule } from 'app/shared/shared.module';

import { CrearOperacionCanjeMesaCambioComponent } from './canje/crear-operacion-canje-mesa-cambio/crear-operacion-canje-mesa-cambio.component';
import { ConsultaCanjeMesaCambioComponent } from './canje/consulta-canje-mesa-cambio/consulta-canje-mesa-cambio.component';
import { OfertaInterbancariaMesaCambioComponent } from './interbancaria/oferta-interbancaria-mesa-cambio/oferta-interbancaria-mesa-cambio.component';
import { DemandaInterbancariaMesaCambioComponent } from './interbancaria/demanda-interbancaria-mesa-cambio/demanda-interbancaria-mesa-cambio.component';
import { PactoInterbanInterbancariaMesaCambioComponent } from './interbancaria/pacto-interban-interbancaria-mesa-cambio/pacto-interban-interbancaria-mesa-cambio.component';
import { ConsultaInterbancariaMesaCambioComponent } from './interbancaria/consulta-interbancaria-mesa-cambio/consulta-interbancaria-mesa-cambio.component';
import { CargaPactoDirectoMesaCambioComponent } from './oper_pactoDirecto/carga-pacto-directo-mesa-cambio/carga-pacto-directo-mesa-cambio.component';
import { ConsultarDirectoMesaCambioComponent } from './oper_pactoDirecto/consultar-directo-mesa-cambio/consultar-directo-mesa-cambio.component';
import { AnulacionMasivaBdvMesaCambioComponent } from './anulacion-masiva-bdv-mesa-cambio/anulacion-masiva-bdv-mesa-cambio.component';

@NgModule({
  declarations: [
        CrearOperacionCanjeMesaCambioComponent,
        ConsultaCanjeMesaCambioComponent,
        OfertaInterbancariaMesaCambioComponent,
        DemandaInterbancariaMesaCambioComponent,
        PactoInterbanInterbancariaMesaCambioComponent,
        ConsultaInterbancariaMesaCambioComponent,
        CargaPactoDirectoMesaCambioComponent,
        ConsultarDirectoMesaCambioComponent,
        AnulacionMasivaBdvMesaCambioComponent,

  ],
  imports: [
    MesaCambioRoutingModule,
    SharedModule
  ]
})
export class MesaCambioModule { }
