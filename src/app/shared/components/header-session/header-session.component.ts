import { Usuario } from 'src/app/shared/models/usuario';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { AuthenticationService } from '../../services/authentication.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-session',
  templateUrl: './header-session.component.html',
  styleUrls: ['./header-session.component.scss']
})
export class HeaderSessionComponent {
  

  modalInicioDeSesion: BsModalRef;
  showTooltip: boolean;

  constructor(
    public authenticationService: AuthenticationService,
    private modalService: BsModalService,
    private router: Router
  ) {
    this.showTooltip = false;
  }

  irAMiPerfil() {
    this.router.navigate(['/mi-perfil']);
  }

  irAMisPostulaciones() {
    this.router.navigate(['/postulaciones']);
  }

  iniciarSesion() {
    this.modalInicioDeSesion = this.modalService.show(LoginModalComponent, {});
  }

  cerrarSesion() {
    
    this.authenticationService.logout(); 
    this.router.navigate(['/']);
    window.location.reload();
    // console.log(this.authenticationService);
  }
 
  toogleTooltip(tooltip: any) {
    tooltip.toggle();
    this.showTooltip = !this.showTooltip;
  }

}
