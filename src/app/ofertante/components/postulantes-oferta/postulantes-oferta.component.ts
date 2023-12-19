import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OfertaEmpleo } from 'src/app/shared/models/oferta-empleo';
import { Postulante } from '../../models/postulante';
import { PostulantesPorOfertaService } from '../../services/postulantes-por-oferta.service';
import { Subscription } from 'rxjs';
import { Oferta } from 'src/app/shared/models/oferta';
import { PostulanteOferta } from 'src/app/shared/models/postulante-oferta';

@Component({
  selector: 'app-postulantes-oferta',
  templateUrl: './postulantes-oferta.component.html',
  styleUrls: ['./postulantes-oferta.component.scss']
})
export class PostulantesOfertaComponent implements OnInit {

  public consultaPostulantes: Subscription;
  @Input() set ofertaSeleccionada(ofertaSeleccionada: Oferta) {
    this.postulantes = null;
    this._ofertaSeleccionada = ofertaSeleccionada;
    console.log(ofertaSeleccionada);
    if (ofertaSeleccionada) {
      this.consultaPostulantes = this.postulantesPorOfertaService.read(ofertaSeleccionada.idOferta).subscribe(
        (results: PostulanteOferta[]) => {
          this.postulantes = results;
          console.log(this.postulantes);
          if (this.consultaPostulantes) { this.consultaPostulantes.unsubscribe(); }
        }, (errors: any) => console.log('Error al obtener postulantes de oferta: ', errors)
      );
    }
  }
  get ofertaSeleccionada(): Oferta {
    return this._ofertaSeleccionada;
  }
  public _ofertaSeleccionada: Oferta;
  @Output() deseleccionar: EventEmitter<boolean>;
  postulantes: PostulanteOferta[];

  constructor(public postulantesPorOfertaService: PostulantesPorOfertaService) {
    this._ofertaSeleccionada = new Oferta();
    this.deseleccionar = new EventEmitter();
    this.consultaPostulantes = null;
  }

  ngOnInit() {
  }

  onRetroceder() {
    this.deseleccionar.emit(true);
  }

}
