import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, onErrorResumeNext } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, delay } from 'rxjs/operators';
import { Postulante } from '../models/postulante';
import { PostulanteOferta } from 'src/app/shared/models/postulante-oferta';

@Injectable()
export class PostulantesPorOfertaService {
  [x: string]: any;

  constructor(private httpClient: HttpClient) { }

  read(idoferta: number): Observable<Array<PostulanteOferta>> { 
    const OPTIONS = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    }; 
    return this.httpClient.get<Array<PostulanteOferta>>(
      `http://localhost:9095/postulanteofertas/obtenerPostulantesPorIdOferta?idoferta=${idoferta}`,
      OPTIONS
    ).pipe(
      map(
        (results: any) => {
          // const ajustados = this.adjustArrayOfArraysToArrayOfObjects(results);
          // for (const postulante of ajustados) {
          //   this.adjustPostulanteFromBackend(postulante);
          // }
          return results;
        }
      )
    );
  }

  getPostulantesPorOferta(idoferta: Number) {
    return this.http.get(`http://localhost:9095/postulanteofertas/obtenerPostulantesPorIdOferta?idoferta=${idoferta}`)
            .pipe(
              map( this.crearArreglo ),
              delay(1500)
            );
  }

  // getOfertas( idofertante: Number ) : Observable<Oferta> {
  //   return this.http.get<Oferta>( `${ this.url }/ofertas/obtenerUsuarioPorEmailYPassword?correo=${idofertante}` )
  // }

  private crearArreglo( postulanteofertaObj: object ) {

    const lista: PostulanteOferta[] = [];

    //Hago un recorrido de obj y le asigno un "key"
    Object.keys( postulanteofertaObj ).forEach( key => {

      //Extraigo el objeto y lo asigno a una referencia
      const postulanteoferta: PostulanteOferta = postulanteofertaObj[key];

      //usuario.id = key;

      //Almaceno los héroes en el arreglo
      lista.push( postulanteoferta );

    });

    //Si no hay información en la base de datos
    if ( postulanteofertaObj === null ) { return []; }

    return lista;
  }

  private adjustArrayOfArraysToArrayOfObjects(wrong: Array<Array<any>>): Array<Postulante> {
    const right = [];
    for (const arr of wrong) {
      const almostRight: Postulante = new Postulante(
        arr[6],
        arr[2],
        arr[5],
        arr[7],
        arr[3],
        arr[5],
        arr[1],
        arr[8],
        arr[9]
      );
      right.push(almostRight);
    }
    return right;
  }

  private adjustPostulanteFromBackend(postulante): void {
    if (postulante.fechapostulacion) {
      postulante.fechapostulacion = new Date(Date.parse(postulante.fechapostulacion));
    }
  }

}
