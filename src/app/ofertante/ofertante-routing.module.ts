import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GestionarOfertasComponent } from './components/gestionar-ofertas/gestionar-ofertas.component';

const routes: Routes = [
  {
    path: '',
    component: GestionarOfertasComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfertanteRoutingModule { }
