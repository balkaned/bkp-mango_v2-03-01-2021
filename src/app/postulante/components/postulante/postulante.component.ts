import { Component, ViewChild, AfterViewInit, OnInit, ApplicationRef } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { OfertaEmpleo } from 'src/app/shared/models/oferta-empleo';
import { Subscription } from 'rxjs';
import { FiltrosOfertasComponent } from '../filtros-ofertas/filtros-ofertas.component';
import { BusquedaOfertasComponent } from '../busqueda-ofertas/busqueda-ofertas.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ResizedEvent } from 'angular-resize-event';
import { trigger, style, animate, transition } from '@angular/animations';
import { OfertasService } from 'src/app/shared/services/ofertas.service';
import { QueryTermService } from '../../services/query-term.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { PostulacionService } from '../../services/postulacion.service';
import { Router } from '@angular/router';
import { Oferta } from 'src/app/shared/models/oferta';

@Component({
  selector: 'app-postulante',
  templateUrl: './postulante.component.html',
  styleUrls: ['./postulante.component.scss'],
  animations: [
    trigger('panelInOut', [
      transition('void => *', [
          style({transform: 'translateX(-100%)'}),
          animate(800)
      ])
    ])
]
})
export class PostulanteComponent implements AfterViewInit, OnInit {

  filtrosBusquedaOfertasEmpleo: string[];
  subscriptionOfertas: Subscription;
  ofertaSeleccionada: Oferta;
  resultadoBusquedaOfertas: OfertaEmpleo[];

  @ViewChild(FiltrosOfertasComponent) filtrosOfertasComponent: FiltrosOfertasComponent;
  @ViewChild(BusquedaOfertasComponent) busquedaOfertasComponent: BusquedaOfertasComponent;

  modalPostulacion: BsModalRef;

  ofertas: Oferta[];

  terminoBusquedaOfertasEmpleo: string;

  constructor(
    private notificationsService: NotificationsService,
    private ofertasService: OfertasService,
    private modalService: BsModalService,
    private queryTermService: QueryTermService,
    public authenticationService: AuthenticationService,
    public postulacionService: PostulacionService,
    public router: Router,
    public appRef: ApplicationRef
  ) {
    this.subscriptionOfertas = null;
    this.ofertaSeleccionada = null;
    this.filtrosBusquedaOfertasEmpleo = null;
    this.resultadoBusquedaOfertas = [];
  }

  ngAfterViewInit() {
    this.queryTermService.busqueda$.subscribe(
      (titulo: string) => {
        this.reconsultarOfertas(titulo);
        this.ofertaSeleccionada = null;
        this.busquedaOfertasComponent.borrarSeleccion();
      }
    );
  }

  ngOnInit() {
    this.authenticationService.loggedIn$.subscribe(
      (loggedIn: boolean) => {
        Promise.resolve(null).then(() => { this.appRef.tick(); });
      }
    );
  }

  private reconsultarOfertas(titulo: string) {

    // const subscription: Subscription = this.ofertasService.getOfertasPostulante()
    //         .subscribe(
    //             (resultados: Oferta[]) => {
    //               this.ofertas = [...resultados];
    //               console.log(this.ofertas);
        
    //               if (subscription) { subscription.unsubscribe(); }
    //             }, (errors: any) => {
    //               this.notificationsService.error('Fallo al buscar ofertas', 'Error Inesperado');
    //               console.log('Fallo al buscar ofertas: ', errors);
    //               if (subscription) { subscription.unsubscribe(); }
    //             }
    //           );

    const subscription: Subscription = this.ofertasService.ofertasPorTitulo(titulo)
            .subscribe(
                (resultados: Oferta[]) => {
                  this.ofertas = [...resultados];
                  console.log(this.ofertas);
        
                  if (subscription) { subscription.unsubscribe(); }
                }, (errors: any) => {
                  this.notificationsService.error('Fallo al buscar ofertas', 'Error Inesperado');
                  console.log('Fallo al buscar ofertas: ', errors);
                  if (subscription) { subscription.unsubscribe(); }
                }
              );



    // if (this.subscriptionOfertas) {
    //   this.subscriptionOfertas.unsubscribe();
    // }
    // this.subscriptionOfertas = this.ofertasService.ofertasPorTitulo(titulo).subscribe(
    //   (resultados: OfertaEmpleo[]) => {
    //     this.resultadoBusquedaOfertas = resultados;
    //   }, (errors: any) => {
    //     this.notificationsService.error('Fallo al buscar ofertas', 'Error Inesperado');
    //     console.log('Fallo al buscar ofertas: ', errors); 
    //   }
    // );
  }

  onError(error: {title: string, message: string}) {
    this.notificationsService.error(error.title, error.message);
  }

  onOfertaSelected(event: Oferta) {
    this.ofertaSeleccionada = event;
    console.log(this.ofertaSeleccionada);
  }

  onRetrocederDesdeDetallesDeOferta(event?) {
    this.ofertaSeleccionada = null;
  }

  postular(oferta?: Oferta) {
    this.notificationsService.success(
      'Postulación Exitosa',
       'Te has postulado a ' + this.ofertaSeleccionada.posicion
    );
  }

  onDetallesResized(event: ResizedEvent): void {
    /*if (this.ofertaSeleccionada === null || this.ofertaSeleccionada === undefined) {
      this.busquedaOfertasComponent.desiredContainerHeight = undefined;
    } else {
      this.busquedaOfertasComponent.desiredContainerHeight = event.newHeight - 35;
    }*/
  }

  onNuevoTerminoDeBusqueda(nuevoTermino: string) {
    this.terminoBusquedaOfertasEmpleo = nuevoTermino;
    this.reconsultarOfertas(this.terminoBusquedaOfertasEmpleo);
  }

  // onFiltroChange(event: {id_filtro: string, checked: boolean}) {
  //   this.filtrosBusquedaOfertasEmpleo =
  //     Array.from(this.filtrosOfertasComponent.itemsSeleccionados);
  //   this.reconsultarOfertas("");
  // }
}
