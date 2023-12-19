import { Oferta } from './../../../shared/models/oferta';
import { Component, Output, EventEmitter, Input, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OfertaEmpleo } from 'src/app/shared/models/oferta-empleo';

@Component({
  selector: 'app-busqueda-ofertas',
  templateUrl: './busqueda-ofertas.component.html',
  styleUrls: ['./busqueda-ofertas.component.scss']
})
export class BusquedaOfertasComponent {

  busqueda$: BehaviorSubject<string>;

  @Output() busqueda: EventEmitter<string>;

  @Output() selected: EventEmitter<Oferta>;

  @Input() ofertas: Oferta[];

  @Output() idOfer = new EventEmitter();

  
  

  screenWidth: any;
 
  desiredContainerHeight: number;

  ofertaSeleccionada: number;

  constructor() {
    this.busqueda$ = new BehaviorSubject(null);
    this.busqueda = new EventEmitter();
    this.selected = new EventEmitter();
    this.ofertaSeleccionada = null;
    this.busqueda$.asObservable().pipe(
      debounceTime(400), distinctUntilChanged()
    ).subscribe(
      (valor: string) => {
        if (valor === undefined || valor === null) { return; }
        if (valor.trim() === '') { return; }
        this.busqueda.emit(valor.trim());
      }
    );
    this.getScreenSize();
    console.log("Bandeja de ofertas"); 
  }

  onOfertaSelected(event: Oferta) { 
    console.log("Entró a seleccionar oferta");
    if (event.idOferta === this.ofertaSeleccionada) {
      this.ofertaSeleccionada = null;
      event = null;
      console.log("PASO 1");
    } else {
      this.ofertaSeleccionada = event.idOferta;

      console.log(event.idOferta);
      console.log("PASO 2");

      //this.selected.emit(event.idOferta);

    }
    console.log(event);
    this.selected.emit(event); 
  }

  @HostListener('window:resize', ['$event']) getScreenSize(event?) {
    this.screenWidth = window.innerWidth;
  }

  reducirResumenDeAcuerdoAlTamanoDeLaPantalla(resumen: string): string {
    if (resumen === null || resumen === undefined) { return ''; }
    if (this.screenWidth < 1200) {
      return resumen.slice(0, (255 * ( (this.screenWidth - 400) / 1200 )));
    }
    return resumen.slice(0, (255 * ( (this.screenWidth - 600) / 1200 )));
  }

  borrarSeleccion() {
    this.ofertaSeleccionada = null;
  }

  primeraPalabra(titulo: string): string {
    const splitted = titulo.split(' ');
    return splitted[0];
  }

}
