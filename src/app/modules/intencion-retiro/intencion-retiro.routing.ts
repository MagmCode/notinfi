import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntencionRetiroComponent } from 'app/modules/intencion-retiro/intencion-retiro.component';


const routes: Routes = [
  {path: 'intencion_retiro', component: IntencionRetiroComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntencionRetiroRoutingModule { }
