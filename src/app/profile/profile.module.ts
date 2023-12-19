import { NotificacionEducacionCreadaService } from './../ofertante/services/notificacion-educacion-creada.service';
import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';

import { SharedModule } from '../shared/shared.module';
import { SimpleNotificationsModule, NotificationAnimationType } from 'angular2-notifications';
import { PerfilComponent } from './components/perfil/perfil.component';
import { ModalExperienciaLaboralComponent } from './components/modal-experiencia-laboral/modal-experiencia-laboral.component';
import { NotificacionOfertaCreadaService } from '../ofertante/services/notificacion-oferta-creada.service';
import { ModalEducacionComponent } from './components/modal-educacion/modal-educacion.component';
import { NotificacionExperienciaLaboralCreadaService } from '../ofertante/services/notificacion-experiencia-laboral-creada.service';

@NgModule({
  declarations: [PerfilComponent,ModalExperienciaLaboralComponent,ModalEducacionComponent],
  imports: [
    ProfileRoutingModule,
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
  providers: [NotificacionOfertaCreadaService, NotificacionExperienciaLaboralCreadaService, NotificacionEducacionCreadaService],
  entryComponents: [ModalExperienciaLaboralComponent,ModalEducacionComponent]
})
export class ProfileModule { }
