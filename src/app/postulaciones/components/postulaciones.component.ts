import { Ofertante } from 'src/app/shared/models/ofertante';
import { UsuarioService } from '../../shared/services/usuario.service';
import { ModalEducacionComponent } from '../../profile/components/modal-educacion/modal-educacion.component';
import { Component, OnInit, AfterViewInit, ApplicationRef, ViewChild } from '@angular/core';
import { DisponibilidadEmailService } from 'src/app/shared/services/disponibilidad-email.service';
import { UserService } from 'src/app/shared/services/user.service';
import { PostulacionService } from 'src/app/postulante/services/postulacion.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { TipoUsuario } from 'src/app/shared/models/tipo-usuario.enum';
import { UpdateDatosPostulante } from 'src/app/shared/models/API/bodies/update-datos-postulante';
import { UpdateDatosOfertante } from 'src/app/shared/models/API/bodies/update-datos-ofertante';
import { Subscription } from 'rxjs';
import { GetUsuario } from 'src/app/shared/models/API/responses/get-usuario';
import { NotificationsService } from 'angular2-notifications';
import { OfertanteService } from 'src/app/shared/services/ofertante.service';
import { IOption } from 'ng-select';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/shared/models/usuario';
import { GetUsuario2 } from 'src/app/shared/models/API/responses/get-usuario2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalOfertaComponent } from 'src/app/ofertante/components/modal-oferta/modal-oferta.component';
import { ModalExperienciaLaboralComponent } from '../../profile/components/modal-experiencia-laboral/modal-experiencia-laboral.component';
import { NotificacionExperienciaLaboralCreadaService } from 'src/app/ofertante/services/notificacion-experiencia-laboral-creada.service';
import { Postulante } from 'src/app/shared/models/postulante';
import { PostulanteService } from 'src/app/shared/services/postulante.service';
import { ExperienciaLaboralService } from 'src/app/shared/services/experiencialaboral.service';
import { ExperienciaLaboral } from 'src/app/shared/models/experiencia-laboral';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostulacionesService } from '../services/postulaciones.service';
import { Postulaciones } from '../models/postulaciones';
import { PostulacionesBusquedaOfertasComponent } from './busqueda-ofertas/postulaciones-busqueda-ofertas.component';
 
@Component({ 
  selector: 'app-postulaciones',
  templateUrl: './postulaciones.component.html',
  styleUrls: ['./postulaciones.component.scss']
})
export class PostulacionesComponent implements OnInit, AfterViewInit {

  public consultaPostulaciones: Subscription;
  postulaciones: Postulaciones[];
  consultando: boolean;
  ofertaSeleccionada: Postulaciones;

  @ViewChild(PostulacionesBusquedaOfertasComponent) busquedaOfertasComponent: PostulacionesBusquedaOfertasComponent;

  constructor(
    public postulacionesService: PostulacionesService,
    public authenticationService: AuthenticationService,
    public router: Router, 
    public appRef: ApplicationRef
  ) {
    this.consultaPostulaciones = null;
    this.consultando = true;
  }
 
  ngOnInit() {
    console.log(this.authenticationService.authentication);
    this.consultando = false;
    this.consultando = false;
    if (this.authenticationService.authentication === null || this.authenticationService.authentication === undefined) {
      this.router.navigate(['/']);
      return;
    }
    if (this.authenticationService.authentication.tipoUsuario !== TipoUsuario.POSTULANTE+"") {
      this.router.navigate(['/']);
      return;
    }
    this.authenticationService.loggedIn$.subscribe(
      (loggedIn: boolean) => {
        if (loggedIn) {
          Promise.resolve(null).then(() => { this.appRef.tick(); });
        } else {
          this.router.navigate(['/']);
        }
      }
    );

    console.log(this.authenticationService.authentication.postulante.idPostulante);
    this.consultaPostulaciones = this.postulacionesService.read(this.authenticationService.authentication.postulante.idPostulante).subscribe(
      (results: Postulaciones[]) => {
        this.postulaciones = results;
        console.log(this.postulaciones);
        this.consultando = false
        if (this.consultaPostulaciones) { this.consultaPostulaciones.unsubscribe(); }
      }, (errors: any) => console.log('Error al obtener postulantes de oferta: ', errors)
    );
  }

  ngAfterViewInit() {
    this.busquedaOfertasComponent.borrarSeleccion();
  }

  onOfertaSelected(event: Postulaciones) {
    this.ofertaSeleccionada = event;
    console.log(this.ofertaSeleccionada);
  }

  onRetrocederDesdeDetallesDeOferta(event?) {
    this.ofertaSeleccionada = null;
  }


}
