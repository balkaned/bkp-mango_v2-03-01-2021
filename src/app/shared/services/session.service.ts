import { GetUsuario2 } from '../models/API/responses/get-usuario2';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { GetUsuario } from '../models/API/responses/get-usuario';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Se utiliza para iniciar sesion.
   */
  // getUserDetails(email: string, pass: string): Observable<GetUsuario> {
  //   const OPTIONS = { headers: new HttpHeaders({'Content-Type':  'application/json'}) };
  //   const URL = `${environment.api_url_list.getUsuario}?email=${email}&pass=${pass}`;
  //   return this.httpClient.get<any>(URL, OPTIONS).pipe(
  //     map(raw => GetUsuario.parse(raw))
  //   );

    getUserDetails(email: string, pass: string): Observable<GetUsuario2> {
      const OPTIONS = { headers: new HttpHeaders({'Content-Type':  'application/json'}) };
      const URL = `http://localhost:9095/usuarios/obtenerUsuarioPorEmailYPassword?correo=${email}&password=${pass}`;
      return this.httpClient.get<any>(URL, OPTIONS).pipe(
        map(raw => GetUsuario2.parse(raw))
      );
    //return null;
  }
}
