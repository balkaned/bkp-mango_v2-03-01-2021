import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IOption } from 'ng-select';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeneralDetService {

  constructor(public httpClient: HttpClient) { }

  obtenerOpcionesParaSelectHTML(id: number): Observable<Array<IOption>> {
    const URL = `${environment.api_url_list.generalDet}?id=${id}`;
    const OPTIONS = { headers: new HttpHeaders({ 'Content-Type':  'application/json' }) };
    return this.httpClient.get<Array<Array<string>>>(URL, OPTIONS).pipe(
      map(
        (results: Array<Array<string>>) => {
          const options = new Array<IOption>();
          for (const option of results) {
            options.push({
              value: option[0],
              label: option[1]
            });
          }
          return options;
        }
      )
    );
  }
}
