import { Component, AfterViewInit, HostListener, OnInit, ApplicationRef } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { OfertaEmpleo } from 'src/app/shared/models/oferta-empleo';
import { Subscription } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { OfertasService } from 'src/app/shared/services/ofertas.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalOfertaComponent } from '../modal-oferta/modal-oferta.component';
import { Router } from '@angular/router';
import { TipoUsuario } from 'src/app/shared/models/tipo-usuario.enum';
import { NotificacionOfertaCreadaService } from '../../services/notificacion-oferta-creada.service';
import { Heroe, HeroesService } from 'src/app/shared/fake-backend/fake-data/heroes.service';
import { Oferta } from 'src/app/shared/models/oferta';
import { Usuario } from 'src/app/shared/models/usuario';
import { OfertanteService } from 'src/app/shared/services/ofertante.service';
import { Ofertante } from 'src/app/shared/models/ofertante';

@Component({
  selector: 'app-gestionar-ofertas',
  templateUrl: './gestionar-ofertas.component.html',
  styleUrls: ['./gestionar-ofertas.component.scss']
})
export class GestionarOfertasComponent implements OnInit {

  screenWidth: any;
  ofertas: Oferta[];
  ofertaSeleccionada: Oferta;

  modalNuevaOferta: BsModalRef;

  consultando: boolean;

  heroes:Heroe[] = [];

  // private user: Usuario;
  ofertantes: Ofertante[] = [];
  //ofertas2: Oferta[];
  ofertas2: Array<Oferta> = [];
  
  constructor(
    private notificationsService: NotificationsService,
    public authenticationService: AuthenticationService,
    private ofertasService: OfertasService,
    private modalService: BsModalService,
    public router: Router,
    public appRef: ApplicationRef,
    public notificacionOfertaCreadaService: NotificacionOfertaCreadaService,
    private _heroesService:HeroesService,
    public ofertanteService: OfertanteService,
  ) {
    this.ofertas = [];
    this.ofertaSeleccionada = null;
    this.consultando = true;

    // if (sessionStorage.getItem("user")) {
    //   this.user = JSON.parse(sessionStorage.getItem("user"));
    // } else {
    //   this.user = new Usuario();
    // }

  }

  redireccionarAMiPerfil() {
    console.log("Se encuentra en gestionar ofertas");
    this.router.navigate(['/mi-perfil']);
  }

  ngOnInit() {
    console.log("Se encuentra en gestionar ofertas");
    this.heroes = this._heroesService.getHeroes();
    this.consultando = false;
    if (this.authenticationService.authentication === null || this.authenticationService.authentication === undefined) {
      this.router.navigate(['/']);
      return;
    }
    if (this.authenticationService.authentication.tipoUsuario !== TipoUsuario.OFERTANTE+"") {
      this.router.navigate(['/']);
      return;
    }
    this.notificacionOfertaCreadaService.ofertaCreada.subscribe(
      (results: boolean) => {
        if (results === true) {
          this.ngAfterViewInit();
        }
      }
    );
    this.authenticationService.loggedIn$.subscribe(
      (loggedIn: boolean) => {
        if (loggedIn) {
          Promise.resolve(null).then(() => { this.appRef.tick(); });
        } else {
          this.router.navigate(['/']);
        }
      }
    );
    this.notificacionOfertaCreadaService.ofertaCreada.subscribe(
      (results: boolean) => {
        if (results === true) {
          this.ngAfterViewInit();
        }
      }
    );
 
  }

   ngAfterViewInit() {
    Promise.resolve(null).then( () => {
      /*const subscription: Subscription = this.ofertasService.ofertasDeEmpleador(
        this.authenticationService.authentication.userData.idusuario
      ).subscribe(*/

        // let arg = this.user.idUsuario+'';
        
        this.ofertanteService.getOfertante(this.authenticationService.authentication.idUsuario+"")
        .subscribe(resp => {
          let objOfertante = new Ofertante();
          console.log(resp);
          objOfertante = resp;
          console.log(objOfertante);

          if(objOfertante != null){
            console.log("Ingresó aquí")
            
            const subscription: Subscription = this.ofertasService.getOfertas(objOfertante.idOfertante)
            .subscribe(
                (resultados: Oferta[]) => {
                  this.ofertas = [...resultados];
                  console.log(this.ofertas);
        
        
                  this.notificacionOfertaCreadaService.ofertaCreada.next(false);
                  this.consultando = false;
                  if (subscription) { subscription.unsubscribe(); }
                }, (errors: any) => {
                  this.notificationsService.error('Fallo al buscar ofertas', 'Error Inesperado');
                  console.log('Fallo al buscar ofertas: ', errors);
                  if (subscription) { subscription.unsubscribe(); }
                }
              );

          }
        });
        

        
    } );
   }

  // @HostListener('window:resize', ['$event']) getScreenSize(event?) {
  //   this.screenWidth = window.innerWidth;
  // }

  // reducirResumenDeAcuerdoAlTamanoDeLaPantalla(resumen: string): string {
  //   if (resumen === null || resumen === undefined) { return ''; }
  //   if (this.screenWidth < 1200) {
  //     return resumen.slice(0, (255 * ( (this.screenWidth - 400) / 1200 )));
  //   }
  //   return resumen.slice(0, (255 * ( (this.screenWidth - 600) / 1200 )));
  // }

  verDetallesDeOferta(oferta: Oferta) {
    this.ofertaSeleccionada = oferta;
    console.log(this.ofertaSeleccionada);
  }

  deseleccionar(event?) {
    this.ofertaSeleccionada = null;
  }

  nuevaOfertaLaboral(event?) { 
    this.modalNuevaOferta = this.modalService.show(ModalOfertaComponent, {class: 'modal-lg'});
  }
}
