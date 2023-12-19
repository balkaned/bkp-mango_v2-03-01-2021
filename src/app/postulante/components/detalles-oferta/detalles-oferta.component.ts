import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { OfertaEmpleo } from 'src/app/shared/models/oferta-empleo';
import { Subscription } from 'rxjs';
import { OfertasService } from 'src/app/shared/services/ofertas.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { PostulacionComponent } from 'src/app/shared/components/postulacion/postulacion.component';
import { TipoUsuario } from 'src/app/shared/models/tipo-usuario.enum';
import { PostulacionService } from '../../services/postulacion.service';
import { Oferta } from 'src/app/shared/models/oferta';
import { BusquedaOfertasComponent } from '../busqueda-ofertas/busqueda-ofertas.component';

@Component({
  selector: 'app-detalles-oferta',
  templateUrl: './detalles-oferta.component.html',
  styleUrls: ['./detalles-oferta.component.scss']
})
export class DetallesOfertaComponent implements OnInit {

  @Input() oferta: Oferta;

  modalPostulacion: BsModalRef;
  postulado: boolean;

  // @ViewChild(BusquedaOfertasComponent) hijo: BusquedaOfertasComponent;

  @Input() idO: EventEmitter<number>;


  consultandoDetallesDeOferta: boolean;
  private _idOfertaLab: number;
  @Input() set idOfertaLab(idOfertaLab: number) {
    if (idOfertaLab !== this._idOfertaLab) {
      this._idOfertaLab = idOfertaLab;
      this.oferta = null;
      console.log(this._idOfertaLab);
      if (this._idOfertaLab) { this.consultarOferta(this._idOfertaLab); }
    }
  }
  //oferta: Oferta;
  @Output() postulacion: EventEmitter<Oferta>;
  @Output() retroceder: EventEmitter<boolean>;

  postulaciones: number[];


  constructor(
    private ofertaService: OfertasService,
    private modalService: BsModalService,
    public authenticationService: AuthenticationService,
    public postulacionService: PostulacionService
  ) {
    this.postulacion = new EventEmitter<Oferta>();
    this.retroceder = new EventEmitter<boolean>();

    this.postulado = null

    this.postulaciones = [];
  }

  ngOnInit() {
    // // console.log(this._idOfertaLab);
    // console.log(this.oferta);
    // this.authenticationService.loggedIn$.subscribe(
    //   (loggedIn: boolean) => {
    //     if (this.oferta === null) { return; }
    //     if (!loggedIn) {
    //       console.log("postulado")
    //       //console.log(this._idOfertaLab);
    //       this.postulado = false;
    //       this.consultarOferta(this._idOfertaLab);

    //       //console.log(this.hijo.id);
    //     } else {
    //       // if (this.authenticationService.authentication.postulaciones) {
    //       //   if (this.authenticationService.authentication.postulaciones.includes(this.oferta.idoferta)) {
    //       //     this.authenticationService.authentication.postulaciones.push(this.oferta.idoferta);
    //       //   }
    //       // }
    //     }
    //   }
    // )

    // this.authenticationService.loggedIn$.subscribe(
    //   (loggedIn: boolean) => {
    //     if (this.oferta === null) { return; }
    //     if (!loggedIn) {
    //       this.oferta.postulado = false;
    //     } else {
    //       if (this.authenticationService.authentication.postulaciones) {
    //         if (this.authenticationService.authentication.postulaciones.includes(this.oferta.idOferta)) {
    //           this.authenticationService.authentication.postulaciones.push(this.oferta.idOferta);
    //         }
    //       }
    //     }
    //   }
    // )
  }

  consultarOferta(idOferta: number) {
    console.log("ENTRÓ A CONSULTAR OFERTA")
    this.consultandoDetallesDeOferta = true;
    console.log(this.authenticationService.authentication);
    // console.log(this.authenticationService.authentication.postulaciones); 
    console.log(this.oferta);
    console.log(this._idOfertaLab);

    // if (this.authenticationService.authentication.postulaciones.includes(this._idOfertaLab)) {
    //   this.postulado = true;
    // } else {
    //   this.postulado = false;
    // }


    const subscription: Subscription = this.ofertaService.read(idOferta).subscribe(
      (results: Oferta) => {
        this.oferta = results;
        console.log(this.postulaciones);
        console.log(this.authenticationService.authentication);
        // console.log(this.authenticationService.authentication.postulaciones);
        console.log(this.oferta.idOferta);

        // this.authenticationService.authentication.postulaciones.forEach(element => {
        //   if(element == this.oferta.idOferta){
        //     console.log("OFERTAS IGUALES");
        //   } else{
        //     console.log("LAS OFERTAS NO SON IGUALES");
        //   }
        // });

        // for(let i = 0; i < this.authenticationService.authentication.postulaciones.length; i++){
        //   if(this.authenticationService.authentication.postulaciones[i] == this.oferta.idOferta){
        //     console.log("OFERTAS IGUALES");
        //     this.oferta.postulado = true;
        //   } else{
        //     console.log("LAS OFERTAS NO SON IGUALES");
        //     this.oferta.postulado = false;
        //   }
        // } 
        console.log(this.oferta);
        console.log(this.authenticationService.authentication);
        console.log(this.oferta.idOferta);
        console.log(this.authenticationService.authentication.postulaciones.includes(this.oferta.idOferta));
        if (this.authenticationService.authentication.postulaciones.includes(this.oferta.idOferta)) {
          this.oferta.postulado = true;
        } else {
          this.oferta.postulado = false;
        }
        console.log(this.oferta.postulado);
        // this.postulado = false;
        this.consultandoDetallesDeOferta = false;
      }
    );
  }

  postular() {
    if (this.authenticationService.loggedIn$.value) {
      if (this.authenticationService.authentication.tipoUsuario === TipoUsuario.POSTULANTE + "") {
        this.postularAOfertaSeleccionada();
      }
    } else {
      this.modalPostulacion = this.modalService.show(
        PostulacionComponent,
        {
          initialState: {
            oferta: this.oferta
          }
        }
      );
    }
  }

  postularAOfertaSeleccionada() {
    // console.log(this.authenticationService.authentication);
    // this.oferta.postulado = false;
    // console.log(this.oferta.postulado);
    // this.oferta.postulado = true;
    //     if (this.authenticationService.authentication.postulaciones) {
    //       this.authenticationService.authentication.postulaciones.push(this.oferta.idOferta);
    //     } else {
    //       this.authenticationService.authentication.postulaciones = [this.oferta.idOferta];
    //     }
    //     this.postulacion.emit(this.oferta);
    //     this.retroceder.emit(null);
    // console.log(this.oferta.postulado);
    // console.log(this.postulaciones);
    // console.log(this.authenticationService.authentication.postulaciones);
 

    console.log(this.authenticationService.authentication);
    console.log(this.oferta.postulado);

    const subscription: Subscription = this.postulacionService.postularAOferta(
      this.oferta.idOferta,
      this.authenticationService.authentication.postulante.idPostulante
    ).subscribe(
      (results: any) => {
        this.oferta.postulado = true;
        if (this.authenticationService.authentication.postulaciones) {
          this.authenticationService.authentication.postulaciones.push(this.oferta.idOferta);
        } else {
          this.authenticationService.authentication.postulaciones = [this.oferta.idOferta];
        }
        this.postulacion.emit(this.oferta);
        this.retroceder.emit(null);
        console.log(this.oferta.postulado);
        console.log(this.postulaciones);
        console.log(this.authenticationService.authentication.postulaciones);
      }, (errors: any) => {
        console.log('Error al postular en oferta (postulacionService.postularAOferta): ', errors);
        if (subscription) { subscription.unsubscribe(); }
      }
    );





  }

  onRetroceder() {
    this.retroceder.emit(true);
  }

}
