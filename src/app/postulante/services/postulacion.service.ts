import { Usuario } from 'src/app/shared/models/usuario';
import { Postulante } from './../../shared/models/postulante';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UpdateDatosPostulante } from 'src/app/shared/models/API/bodies/update-datos-postulante';

@Injectable()
export class PostulacionService {

  constructor(
    private httpClient: HttpClient
  ) {
  }

  subirCVPostulante(idusuario: number, formData: FormData): Observable<number> {
    /**
     * Recibe 'file'=>file en form-data segun lo que funciona en el postman
     * por lo tanto el formdata debe tener el archivo asignado al key 'file'
     */
    const URL = `${environment.api_url_list.uploadFilePostulante}?idusuario=${idusuario}`;
    return this.httpClient.post<number>(URL, formData);
  }

  updateFilePostulante(idpostulante: number, formData: FormData): Observable<number> {
    /**
     * Recibe 'file'=>file en form-data segun lo que funciona en el postman
     * por lo tanto el formdata debe tener el archivo asignado al key 'file'
     */
    const URL = `${environment.api_url_list.updateFilePostulante}?idpostulante=${idpostulante}`;
    return this.httpClient.put<number>(URL, formData);
  }

  createPostulante(idpostulante: number, titulo: string, resumen: string, enlace: string): Observable<number> {
    const OPTIONS = { headers: new HttpHeaders({'Content-Type':  'application/json'}) };
    const BODY = {titulo, resumen, enlace};
    const URL = `${environment.api_url_list.createPostulante}?idpostulante=${idpostulante}`;
    return this.httpClient.post<number>(URL, BODY, OPTIONS);
  }

  // updatePostulante(BODY: UpdateDatosPostulante): Observable<number> {
  //   const OPTIONS = { headers: new HttpHeaders({'Content-Type':  'application/json'}) };
  //   const URL = environment.api_url_list.updatePostulante;
  //   return this.httpClient.put<number>(URL, BODY, OPTIONS);
  // }

  updatePostulante(BODY: Postulante): Observable<number> {
    const OPTIONS = { headers: new HttpHeaders({'Content-Type':  'application/json'}) };
    const URL = `http://localhost:9095/postulantes`;
    return this.httpClient.put<number>(URL, BODY, OPTIONS);
  }

  // updateUsuario(BODY: Usuario): Observable<number> {
  //   const OPTIONS = { headers: new HttpHeaders({'Content-Type':  'application/json'}) };
  //   const URL = `http://localhost:9095/usuarios`;
  //   return this.httpClient.put<number>(URL, BODY, OPTIONS);
  // }

  // postularAOferta(idOfertaLab: number, idpostulante: number): Observable<{Resultado: string}> {
  //   const URL =
  //   `${environment.api_url_list.createPostulanteOferta}?idOfertaLab=${idOfertaLab}&idpostulante=${idpostulante}`;
  //   const OPTIONS = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
  //   return this.httpClient.post<{Resultado: string}>(URL, {}, OPTIONS);
  // }

  postularAOferta(idOferta: number, idPostulante: number): Observable<{Resultado: string}> {
    const URL =
    `http://localhost:9095/postulanteofertas?idOferta=${idOferta}&idPostulante=${idPostulante}`;
    const OPTIONS = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<{Resultado: string}>(URL, {}, OPTIONS);
  }

}
