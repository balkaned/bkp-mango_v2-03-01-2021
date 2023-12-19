import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { LoginModalComponent } from 'src/app/shared/components/login-modal/login-modal.component';
import { PostulacionComponent } from 'src/app/shared/components/postulacion/postulacion.component';
import { RegistroOfertanteComponent } from 'src/app/shared/components/registro-ofertante/registro-ofertante.component';
import { TipoUsuario } from 'src/app/shared/models/tipo-usuario.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  modalInicioDeSesion: BsModalRef;
  modalPostulante: BsModalRef;
  modalOfertante: BsModalRef;

  constructor(
    public authenticationService: AuthenticationService,
    private modalService: BsModalService,
    public router: Router
  ) { }

  ngOnInit() {
    if (!this.authenticationService.loggedIn$.value) { return; }
    if (this.authenticationService.authentication.tipoUsuario === TipoUsuario.OFERTANTE+"") {
      this.router.navigate(['/ofertante']);
    } else if (this.authenticationService.authentication.tipoUsuario === TipoUsuario.POSTULANTE+"") {
      this.router.navigate(['/']);
    }
  }

  iniciarSesion() {
    this.modalInicioDeSesion = this.modalService.show(LoginModalComponent, {});
  }

  registrarPostulante() {
    this.modalPostulante = this.modalService.show(PostulacionComponent, {});
  }

  registrarOfertante() {
    this.modalOfertante = this.modalService.show(RegistroOfertanteComponent, {class: 'modal-lg'});
  }

}
