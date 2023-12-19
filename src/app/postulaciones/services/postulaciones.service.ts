import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, onErrorResumeNext } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, delay } from 'rxjs/operators';
import { PostulanteOferta } from 'src/app/shared/models/postulante-oferta';
import { Postulaciones } from '../models/postulaciones';

@Injectable()
export class PostulacionesService {
  [x: string]: any;

  constructor(private httpClient: HttpClient) { }

  read(idpostulante: number): Observable<Array<Postulaciones>> { 
    const OPTIONS = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    }; 
    return this.httpClient.get<Array<Postulaciones>>(
      `http://localhost:9095/postulanteofertas/obtenerOfertaPorIdPostulante?idpostulante=${idpostulante}`,
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

  // private adjustArrayOfArraysToArrayOfObjects(wrong: Array<Array<any>>): Array<Postulante> {
  //   const right = [];
  //   for (const arr of wrong) {
  //     const almostRight: Postulante = new Postulante(
  //       arr[6],
  //       arr[2],
  //       arr[5],
  //       arr[7],
  //       arr[3],
  //       arr[5],
  //       arr[1],
  //       arr[8],
  //       arr[9]
  //     );
  //     right.push(almostRight);
  //   }
  //   return right;
  // }

  private adjustPostulanteFromBackend(postulante): void {
    if (postulante.fechapostulacion) {
      postulante.fechapostulacion = new Date(Date.parse(postulante.fechapostulacion));
    }
  }

}
