import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { filtrosOfertas } from './fake-data/filtros-ofertas.fake';
import { OfertaEmpleo } from '../models/oferta-empleo';
import { ofertasEmpleo } from './fake-data/ofertas-empleo.fake';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FakeService {

  filtrosOfertas: {id_filtro: string, nombre: string, tipo: number}[];
  ofertasEmpleo: OfertaEmpleo[];
  emailsTomados: string[];
  credentials: {user: string; password: string}[];

  constructor() {
    this.filtrosOfertas = JSON.parse(JSON.stringify(filtrosOfertas));
    this.ofertasEmpleo = JSON.parse(JSON.stringify(ofertasEmpleo));
    this.emailsTomados = [];
    this.credentials = [
      {
        user: 'webjesustenias@gmail.com',
        password: '12345678'
      },
      {
        user: 'Enrique Baldeon',
        password: '123'
      }
    ];
  }

  login(BODY: { user: string; password: string; }): Observable<{ access_token: string }> {
    for (const cred of this.credentials) {
      if (cred.user === BODY.user && cred.password === BODY.password) {
        return of({
          access_token: '1bbea46b-93fe-4efa-b25a-eb6d5fac60c0',
          refresh_token: '9d0e195c-3077-458a-8906-75f2596a48db',
          scope: 'read write trust',
          token_type: 'bearer'
        }).pipe(delay(400));
      }
    }
    return of({
      access_token: null
    }).pipe(delay(400));
  }

  readAllFiltrosOfertas(): Observable<{id_filtro: string, nombre: string, tipo: number}[]> {
    return of(this.filtrosOfertas).pipe(delay(350));
  }

  buscarOfertasDeEmpleo(
    busqueda: string,
    filtros: string[]
  ): Observable<Array<OfertaEmpleo>> {
    const coincidencias: Array<OfertaEmpleo> = [];
    if (busqueda) {
      for (const oferta of this.ofertasEmpleo) {
        if (oferta.tituloanuncio.toLowerCase().indexOf(busqueda.toLowerCase()) > -1) {
          if (filtros) {
            if (filtros.length) {
              const coincideArea = filtros.includes(oferta.area);
              const coincideTipo = filtros.includes(oferta.tipopuesto);
              if ((coincideArea && !coincideTipo) || (!coincideArea && coincideTipo)) {
                coincidencias.push(oferta);
              }
            } else {
              coincidencias.push(oferta);
            }
          } else {
            coincidencias.push(oferta);
          }
        }
      }
    } else {
      for (const oferta of this.ofertasEmpleo) {
        if (filtros) {
          if (filtros.length) {
            const coincideArea = filtros.includes(oferta.area);
            const coincideTipo = filtros.includes(oferta.tipopuesto);
            if ((coincideArea && !coincideTipo) || (!coincideArea && coincideTipo)) {
              coincidencias.push(oferta);
            }
          } else {
            coincidencias.push(oferta);
          }
        } else {
          coincidencias.push(oferta);
        }
      }
    }
    return of(JSON.parse(JSON.stringify(coincidencias))).pipe(delay(900));
  }

  verificarDisponibilidadDeEmail(email: string): Observable<boolean> {
    return of(!this.emailsTomados.includes(email)).pipe(delay(300));
  }
}
