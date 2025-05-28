import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IntencionVentaComponent } from 'app/modules/intencion-venta/intencion-venta.component';

const routes: Routes = [
  {
    path: 'intencion_venta', component: IntencionVentaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntencionVentaRoutingModule { }
