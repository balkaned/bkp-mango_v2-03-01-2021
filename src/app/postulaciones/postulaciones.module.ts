import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { SimpleNotificationsModule, NotificationAnimationType } from 'angular2-notifications';

import { HeroesService } from '../shared/fake-backend/fake-data/heroes.service';
import { PostulacionesComponent } from './components/postulaciones.component';
import { PostulacionesRoutingModule } from './postulaciones-routing.module';
import { PostulacionesService } from './services/postulaciones.service';
import { PostulacionesBusquedaOfertasComponent } from './components/busqueda-ofertas/postulaciones-busqueda-ofertas.component';
import { PostulacionesDetallesOfertaComponent } from './components/detalles-oferta/postulaciones-detalles-oferta.component';

@NgModule({
  declarations: [
    PostulacionesComponent,
    PostulacionesBusquedaOfertasComponent,
    PostulacionesDetallesOfertaComponent,
  ],
  imports: [
    PostulacionesRoutingModule,
    SharedModule,
    SimpleNotificationsModule.forRoot({
      position: ['top', 'left'],
      timeOut: 2000,
      showProgressBar: true,
      pauseOnHover: true,
      lastOnBottom: true,
      clickToClose: false,
      maxLength: 0, 
      maxStack: 1,
      rtl: false,
      preventDuplicates: false, 
      preventLastDuplicates: false,
      animate: NotificationAnimationType.FromRight
    })
  ],
  providers: [PostulacionesService],
  entryComponents: [],
  exports: [
    PostulacionesComponent
  ]
})
export class PostulacionesModule { }
