import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostulacionesComponent } from './components/postulaciones.component';

const routes: Routes = [
  {
    path: '',
    component: PostulacionesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostulacionesRoutingModule { }
