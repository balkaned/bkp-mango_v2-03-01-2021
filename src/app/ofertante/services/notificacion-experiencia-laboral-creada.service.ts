import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class NotificacionExperienciaLaboralCreadaService {

  public experienciaLaboralCreada: BehaviorSubject<boolean>;

  constructor() {
    this.experienciaLaboralCreada = new BehaviorSubject<boolean>(false);
  }

}
