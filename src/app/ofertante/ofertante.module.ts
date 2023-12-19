import { NgModule } from '@angular/core';

import { OfertanteRoutingModule } from './ofertante-routing.module';
import { ModalOfertaComponent } from './components/modal-oferta/modal-oferta.component';
import { SharedModule } from '../shared/shared.module';
import { SimpleNotificationsModule, NotificationAnimationType } from 'angular2-notifications';
import { GestionarOfertasComponent } from './components/gestionar-ofertas/gestionar-ofertas.component';
import { PostulantesOfertaComponent } from './components/postulantes-oferta/postulantes-oferta.component';
import { PostulantesPorOfertaService } from './services/postulantes-por-oferta.service';
import { NotificacionOfertaCreadaService } from './services/notificacion-oferta-creada.service';
import { HeroesService } from '../shared/fake-backend/fake-data/heroes.service';
import { NotificacionExperienciaLaboralCreadaService } from './services/notificacion-experiencia-laboral-creada.service';
import { NotificacionEducacionCreadaService } from './services/notificacion-educacion-creada.service';

@NgModule({
  declarations: [
    ModalOfertaComponent,
    GestionarOfertasComponent,
    PostulantesOfertaComponent
  ],
  imports: [
    OfertanteRoutingModule,
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
  providers: [PostulantesPorOfertaService, NotificacionOfertaCreadaService, HeroesService, NotificacionExperienciaLaboralCreadaService, NotificacionEducacionCreadaService],
  entryComponents: [ModalOfertaComponent]
})
export class OfertanteModule { }
