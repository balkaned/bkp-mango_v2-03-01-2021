import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FakeService } from 'src/app/shared/fake-backend/fake.service';
import { OfertaEmpleo } from 'src/app/shared/models/oferta-empleo';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map, delay } from 'rxjs/operators';
import { IOption } from 'ng-select';
import { GeneralDetService } from './general-det.service';
import { Oferta } from '../models/oferta';
import { ExperienciaLaboral } from '../models/experiencia-laboral';


@Injectable({
  providedIn: 'root'
})
export class ExperienciaLaboralService {

  private url = 'http://localhost:9095';
  
  constructor(
    private httpClient: HttpClient,
    private generalDetService: GeneralDetService,
    private http: HttpClient
  ) {}

  crearExperienciaLaboral( experienciaLaboral: ExperienciaLaboral) {

    //Retorna el Id de héroe, esto es un método observable
    return this.http.post(`${ this.url }/experienciaslaborales`, experienciaLaboral)
            .pipe(
              //Método "pipe" de los observables
              map( (resp:any) => {
                //El map recibe la respuesta de la petición, lo que responda http.post en este caso (Id)
                experienciaLaboral.idExperienciaLaboral = resp.idExperienciaLaboral;
                return experienciaLaboral; //Retorna el héroe ya manipulado (una instancia)
              })
            );

    //El operador "map" transforma lo que un observable puede regresar
  }

  // getOfertas() {
  //   return this.http.get(`${ this.url }/ofertas`)
  //           .pipe(
  //             map( this.crearArreglo ),
  //             delay(1500)
  //           );
  // }

  getExperienciaLaboral(idpostulante: Number) {
    return this.http.get(`${ this.url }/experienciaslaborales/obtenerExperienciaLaboralPorIdPostulante?idpostulante=${idpostulante}`)
            .pipe(
              map( this.crearArreglo ),
              delay(1500)
            );
  }

  // getOfertas( idofertante: Number ) : Observable<Oferta> {
  //   return this.http.get<Oferta>( `${ this.url }/ofertas/obtenerUsuarioPorEmailYPassword?correo=${idofertante}` )
  // }

  private crearArreglo( experienciaLaboralObj: object ) {

    const experienciaslaborales: ExperienciaLaboral[] = [];

    //Hago un recorrido de obj y le asigno un "key"
    Object.keys( experienciaLaboralObj ).forEach( key => {

      //Extraigo el objeto y lo asigno a una referencia
      const experienciaLaboral: ExperienciaLaboral = experienciaLaboralObj[key];

      //usuario.id = key;

      //Almaceno los héroes en el arreglo
      experienciaslaborales.push( experienciaLaboral );

    });

    //Si no hay información en la base de datos
    if ( experienciaLaboralObj === null ) { return []; }

    return experienciaslaborales;
  }


  getOfertasPostulante() { 
    console.log("Entró a servicio ofertas");
    return this.http.get(`${ this.url }/ofertas`)
            .pipe(
              map( this.crearArregloOfertas ),
              delay(1500)
            );
  }

  private crearArregloOfertas( ofertasObj: object ) {

    const ofertas: Oferta[] = [];

    //Hago un recorrido de obj y le asigno un "key"
    Object.keys( ofertasObj ).forEach( key => {

      //Extraigo el objeto y lo asigno a una referencia
      const oferta: Oferta = ofertasObj[key];

      //usuario.id = key;

      //Almaceno los héroes en el arreglo
      ofertas.push( oferta );

    });

    //Si no hay información en la base de datos
    if ( ofertasObj === null ) { return []; }

    return ofertas;
  }



  createOferta(
    ofertanteid: number,
    anioexperiencia: string, // number pero en string
    area: string, // number pero en string
    condicionlaboral: string,
    funciones: string,
    tituloanuncio: string,
    requisitos: string
  ): Observable<{Resultado: string}> {
    console.log(anioexperiencia+' - '+area+' - '+condicionlaboral+' - '+funciones+' - '+tituloanuncio+' - '+requisitos)
    const now: Date = new Date();
    const fechapublicacion = now.toISOString();
    const URL = environment.api_url_list.createOferta;
    const BODY = {
      anioexperiencia,
      area,
      condicionlaboral,
      fechapublicacion,
      funciones,
      ofertanteid,
      tituloanuncio,
      requisitos
    };
    const OPTIONS = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.httpClient.post<{Resultado: string}>(URL, BODY, OPTIONS);
    //return '';
  }

  getAll(): Observable<Array<any>> {
    const OPTIONS = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    const URL = environment.api_url_list.getAllOfertaLaboral; 
    return this.httpClient.get<Array<any>>(URL, OPTIONS);
  }

  ofertasPorTitulo(titulo: string): any {
    return this.getAll().pipe(
      map(
        (results: Array<any>) => {
          for (const oferta of results) {
            this.adjustOfertaFromBackend(oferta);
          }
          return results;
        }
      )
    ).pipe(
      map(
        (results: Array<any>) => {
          if (titulo === null || titulo === undefined) { return results; }
          if (titulo.trim().length === 0) { return results; }
          const query: string = titulo.trim().toLowerCase();
          const resultadosFiltrados = [];
          for (const oferta of results) {
            const against: string  = oferta.tituloanuncio.trim().toLowerCase();
            if (against.indexOf(query) > -1) { resultadosFiltrados.push(oferta); }
          }
          return resultadosFiltrados;
        }
      )
    );
  }

  query(term: string, filters: string[]): Observable<Array<OfertaEmpleo>> {
    return this.getAll().pipe(
      map(
        (results: Array<any>) => {
          for (const oferta of results) {
            this.adjustOfertaFromBackend(oferta);
          }
          return results;
        }
      )
    );
  }

  ofertasDeEmpleador(idofertante: number): Observable<Array<OfertaEmpleo>> {
    const URL = `${environment.api_url_list.getAllOfertaLaboralByOfertante}?idofertante=${idofertante}`;
    const OPTIONS = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.httpClient.get<Array<any>>(URL, OPTIONS).pipe(
      map(
        (results: Array<any>) => {
          for (const oferta of results) {
            this.adjustOfertaFromBackend(oferta);
          }
          return results;
        }
      )
    );
  }

  read(idOfertaLab: number): Observable<OfertaEmpleo> {
    const OPTIONS = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.httpClient.get<OfertaEmpleo>(
      `${environment.api_url_list.getOferta}?idOfertaLab=${idOfertaLab}`,
      OPTIONS
    ).pipe(
      map(
        (oferta: any) => {
          this.adjustOfertaFromBackend(oferta);
          return oferta;
        }
      )
    );
  }

  private adjustOfertaFromBackend(oferta): void {
    if (oferta.fechacreacion) {
      oferta.fechacreacion = new Date(Date.parse(oferta.fechacreacion));
    }
    if (oferta.fechapublicacion) {
      oferta.fechapublicacion = new Date(Date.parse(oferta.fechapublicacion));
    }
    if (oferta.fechafinpublicacion) {
      oferta.fechafinpublicacion = new Date(Date.parse(oferta.fechafinpublicacion));
    }
  }

  obtenerAreasDeOferta(): Observable<Array<IOption>> {
    return this.generalDetService.obtenerOpcionesParaSelectHTML(13);
  }

}
