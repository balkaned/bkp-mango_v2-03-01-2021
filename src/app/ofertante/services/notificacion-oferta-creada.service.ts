import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class NotificacionOfertaCreadaService {

  public ofertaCreada: BehaviorSubject<boolean>;

  constructor() {
    this.ofertaCreada = new BehaviorSubject<boolean>(false);
  }

}
