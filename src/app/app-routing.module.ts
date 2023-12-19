import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'ofertas',
    loadChildren: './postulante/postulante.module#PostulanteModule'
  },
  {
    path: 'sign-up',
    loadChildren: './signup/signup.module#SignupModule'
  },
  {
    path: 'ofertante',
    loadChildren: './ofertante/ofertante.module#OfertanteModule'
  },
  {
    path: 'mi-perfil',
    loadChildren: './profile/profile.module#ProfileModule'
  },
  {
    path: 'postulaciones',
    loadChildren: './postulaciones/postulaciones.module#PostulacionesModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
