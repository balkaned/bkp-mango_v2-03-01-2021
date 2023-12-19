import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOption } from 'ng-select';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeneralDetService } from './general-det.service';
import { environment } from 'src/environments/environment';
import { UpdateDatosOfertante } from '../models/API/bodies/update-datos-ofertante';
import { Ofertante } from '../models/ofertante';
import { map, delay } from 'rxjs/operators';
import { Postulante } from '../models/postulante';

@Injectable({
  providedIn: 'root'
})
export class PostulanteService {

  private url = 'http://localhost:9095';

  constructor(
    public httpClient: HttpClient,
    public generalDetService: GeneralDetService,
    private http: HttpClient
  ) { }

  getRubrosDisponibles(): Observable<Array<IOption>> {
    return this.generalDetService.obtenerOpcionesParaSelectHTML(11);
  }

  uploadFileOfertante(idusuario: number, formData: FormData): Observable<number> {
    const URL = `${environment.api_url_list.uploadFileOfertante}?idusuario=${idusuario}`;
    console.log(URL);
    //return null;
    return this.httpClient.post<number>(URL, formData);
  }

  crearPostulante( postulante: Postulante) {

    //Retorna el Id de héroe, esto es un método observable
    return this.http.post(`${ this.url }/postulantes`, postulante)
            .pipe(
              //Método "pipe" de los observables
              map( (resp:any) => {
                //El map recibe la respuesta de la petición, lo que responda http.post en este caso (Id)
                postulante.idPostulante = resp.idPostulante;
                return postulante; //Retorna el héroe ya manipulado (una instancia)
              })
            );
 
    //El operador "map" transforma lo que un observable puede regresar
  }

  getPostulante( idusuario: String ) : Observable<Postulante> {
    return this.http.get<Postulante>( `${ this.url }/postulantes/obtenerPostulantePorIdUsuario?idusuario=${idusuario}` )
  }

  getPostulantes() {
    return this.http.get(`${ this.url }/postulantes`)
            .pipe(
              map( this.crearArreglo ),
              delay(1500)
            );
  }

  private crearArreglo( postulantesObj: object ) {

    const postulantes: Postulante[] = [];

    //Hago un recorrido de obj y le asigno un "key"
    Object.keys( postulantesObj ).forEach( key => {

      //Extraigo el objeto y lo asigno a una referencia
      const postulante: Postulante = postulantesObj[key];

      //usuario.id = key;

      //Almaceno los héroes en el arreglo
      postulantes.push( postulante );

    });

    //Si no hay información en la base de datos
    if ( postulantesObj === null ) { return []; }

    return postulantes;
  }


  createOfertante(
    idusuario: number,
    rubro: number,
    ruc: string,
    resumen: string,
    representante: string,
    descripcionempresa: string
  ): Observable<number> {
    const URL = `${environment.api_url_list.createOfertante}?idofertante=${idusuario}&rubro=${rubro}`;
    const BODY = {ruc, resumen, representante, descripcionempresa};
    const OPTIONS = { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) };
    console.log(URL);
    console.log(BODY);
    //return null;
    return this.httpClient.post<number>(URL, BODY, OPTIONS);
  }

  updateDatosOfertante(BODY: UpdateDatosOfertante) {
    const URL = `${environment.api_url_list.updateDatosOfertante}`;
    const OPTIONS = { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) };
    return this.httpClient.put(URL, BODY, OPTIONS);
  }

  updateFileOfertante(idofertante: number, formData: FormData): Observable<number> {
    const URL = `${environment.api_url_list.updateFileOfertante}?idofertante=${idofertante}`;
    return this.httpClient.put<number>(URL, formData);
  }

  updatePosXEstado(): Observable<any> {
    const URL = `${environment.api_url_list.actualizarEstadoDePostulacion}?idoferta=17&estado=2&idpostulante=167`;
    return this.httpClient.post<any>(URL, {});
  }
}
