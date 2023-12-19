import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { FakeService } from 'src/app/shared/fake-backend/fake.service';

@Injectable()
export class FiltrosOfertasService {

  constructor(private httpClient: HttpClient, private fakeService: FakeService) {}

  readAll(): Observable<{id_filtro: string, nombre: string, tipo: number}[]> {
    if (environment.server) {
      return this.httpClient.get<any>(`${environment.server}/api/v1/filtros-ofertas/`);
    }
    return this.fakeService.readAllFiltrosOfertas();
  }
}
