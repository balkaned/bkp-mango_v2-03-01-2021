import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FakeService } from 'src/app/shared/fake-backend/fake.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DisponibilidadEmailService {

  constructor(private httpClient: HttpClient, private fakeService: FakeService) { }

  verificarDisponibilidad(email: string): Observable<boolean> {
    return this.httpClient.get<boolean>(`${environment.api_url_list.validarEmail}?email=${email}`);
  }
}
