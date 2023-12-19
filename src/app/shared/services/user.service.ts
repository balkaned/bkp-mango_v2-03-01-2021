import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoUsuario } from '../models/tipo-usuario.enum';
import { environment } from 'src/environments/environment';
import { UpdateDatosUsuario } from '../models/API/bodies/update-datos-usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Para subir foto de usuario tanto para postulante como para ofertante
   */
  uploadFileUsuario(formData: FormData): Observable<number> {
    /**
     * Recibe 'file'=>file en form-data segun lo que funciona en el postman
     * por lo tanto el formdata debe tener el archivo asignado al key 'file'
     */
    const URL = environment.api_url_list.uploadFileUsuario;
    console.log(URL)
    //return null;
    return this.httpClient.post<number>(URL, formData);
  }

  /**
   * Para sustituir la foto de usuario
   */
  updateFotoUsuario(id_usuario: number, formData: FormData): Observable<number> {
    const URL = `${environment.api_url_list.updateFotoUsuario}?idusuario=${id_usuario}`;
    return this.httpClient.put<number>(URL, formData);
  }

  /**
   * Para crear tanto postulante como ofertante
   */
  createUsuario(idusuario: number, email: string, password: string, tipousuario: TipoUsuario): Observable<number> {
    const tipoUsuario = String(tipousuario).valueOf();
    const OPTIONS = { headers: new HttpHeaders({'Content-Type':  'application/json'}) };
    const BODY = {email, password, tipoUsuario};
    const URL = `${environment.api_url_list.createUsuario}?idusuario=${idusuario}`;
    console.log(idusuario, email, password, tipousuario);
    //return null;
    return this.httpClient.post<number>(URL, BODY, OPTIONS);
  }

  /**
   * Para actualizar parcialmente los datos de un usuario, postulante u ofertante
   */
  updateDatosUsuario(BODY: UpdateDatosUsuario): Observable<number> {
    const OPTIONS = { headers: new HttpHeaders({'Content-Type':  'application/json'}) };
    const URL = environment.api_url_list.updateDatosUsuario;
    return this.httpClient.put<number>(URL, BODY, OPTIONS);
  }
}
