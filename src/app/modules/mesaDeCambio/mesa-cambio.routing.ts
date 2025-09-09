import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { CrearOperacionCanjeMesaCambioComponent } from './canje/crear-operacion-canje-mesa-cambio/crear-operacion-canje-mesa-cambio.component';
import { ConsultaCanjeMesaCambioComponent } from './canje/consulta-canje-mesa-cambio/consulta-canje-mesa-cambio.component';
import { OfertaInterbancariaMesaCambioComponent } from './interbancaria/oferta-interbancaria-mesa-cambio/oferta-interbancaria-mesa-cambio.component';
import { DemandaInterbancariaMesaCambioComponent } from './interbancaria/demanda-interbancaria-mesa-cambio/demanda-interbancaria-mesa-cambio.component';
import { PactoInterbanInterbancariaMesaCambioComponent } from './interbancaria/pacto-interban-interbancaria-mesa-cambio/pacto-interban-interbancaria-mesa-cambio.component';
import { ConsultaInterbancariaMesaCambioComponent } from './interbancaria/consulta-interbancaria-mesa-cambio/consulta-interbancaria-mesa-cambio.component';
import { CargaPactoDirectoMesaCambioComponent } from './oper_pactoDirecto/carga-pacto-directo-mesa-cambio/carga-pacto-directo-mesa-cambio.component';
import { ConsultarDirectoMesaCambioComponent } from './oper_pactoDirecto/consultar-directo-mesa-cambio/consultar-directo-mesa-cambio.component';
import { AnulacionMasivaBdvMesaCambioComponent } from './anulacion-masiva-bdv-mesa-cambio/anulacion-masiva-bdv-mesa-cambio.component';
import { AnulacionMasivaMesaCambioComponent } from './anulacion-masiva-mesa-cambio/anulacion-masiva-mesa-cambio.component';
import { CambioClaveMesaCambioComponent } from './cambio-clave-mesa-cambio/cambio-clave-mesa-cambio.component';
import { ConsultabcvIntervencionComponent } from '../intervencion/consultabcv-intervencion/consultabcv-intervencion.component';
import { ConsultabcvMesaCambioComponent } from './consultabcv-mesa-cambio/consultabcv-mesa-cambio.component';


const routes: Routes = [
  {
    path: 'pacto-directo', children: [
    {path: 'carga', component: CargaPactoDirectoMesaCambioComponent},
    {path: 'consultar', component: ConsultarDirectoMesaCambioComponent},
  ]
},
{
  path: 'interbancaria', children: [
    {path: 'oferta', component: OfertaInterbancariaMesaCambioComponent},
    {path: 'demanda', component: DemandaInterbancariaMesaCambioComponent},
    {path: 'pacto-interbancario', component: PactoInterbanInterbancariaMesaCambioComponent},
    {path: 'consulta', component: ConsultaInterbancariaMesaCambioComponent},
  ]
  },
  {
    path: 'canje', children: [
      { path: 'crear-operacion', component: CrearOperacionCanjeMesaCambioComponent },
      { path: 'consulta', component: ConsultaCanjeMesaCambioComponent }
    ]
  },
  { path: 'anulacion-masiva-bdv', component: AnulacionMasivaBdvMesaCambioComponent},
  { path: 'anulacion-masiva-bcv', component: AnulacionMasivaMesaCambioComponent},
  { path: 'cambio-clave', component: CambioClaveMesaCambioComponent},
  { path: 'consulta-bcv', component: ConsultabcvMesaCambioComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MesaCambioRoutingModule { }
