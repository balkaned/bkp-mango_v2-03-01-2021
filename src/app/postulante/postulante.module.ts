import { NgModule } from '@angular/core';

import { SimpleNotificationsModule, NotificationAnimationType } from 'angular2-notifications';

import { PostulanteRoutingModule } from './postulante-routing.module';

import { SharedModule } from '../shared/shared.module';
import { AngularResizedEventModule } from 'angular-resize-event';

import { BusquedaOfertasComponent } from './components/busqueda-ofertas/busqueda-ofertas.component';
import { FiltrosOfertasComponent } from './components/filtros-ofertas/filtros-ofertas.component';
import { DetallesOfertaComponent } from './components/detalles-oferta/detalles-oferta.component';
import { PostulanteComponent } from './components/postulante/postulante.component';
import { InputBuscadorOfertasComponent } from './components/input-buscador-ofertas/input-buscador-ofertas.component';

import { QueryTermService } from './services/query-term.service';
import { PostulacionService } from './services/postulacion.service';
import { FiltrosOfertasService } from './services/filtros-ofertas.service';

@NgModule({
  imports: [
    PostulanteRoutingModule,
    SharedModule,
    AngularResizedEventModule,
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
  declarations: [
    BusquedaOfertasComponent,
    FiltrosOfertasComponent,
    DetallesOfertaComponent,
    PostulanteComponent,
    InputBuscadorOfertasComponent,
  ],
  providers: [
    QueryTermService,
    PostulacionService,
    FiltrosOfertasService
  ],
  exports: [
    PostulanteComponent
  ]
})
export class PostulanteModule { }
