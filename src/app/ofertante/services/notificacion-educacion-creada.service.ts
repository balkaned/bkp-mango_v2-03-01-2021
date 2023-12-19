import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class NotificacionEducacionCreadaService {

  public educacionCreada: BehaviorSubject<boolean>;

  constructor() {
    this.educacionCreada = new BehaviorSubject<boolean>(false);
  }

}
