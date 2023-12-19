import { Injectable, EventEmitter, Output } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class QueryTermService {

  busqueda$: BehaviorSubject<string>;
  @Output() busqueda: EventEmitter<string>;

  constructor() {
    this.busqueda$ = new BehaviorSubject(null);
    this.busqueda = new EventEmitter();
    this.busqueda$.asObservable().pipe(
      debounceTime(400), distinctUntilChanged()
    ).subscribe(
      (valor: string) => {
        if (valor === undefined || valor === null) { return; }
        if (valor.trim() === '') { return; }
        this.busqueda.emit(valor.trim());
      }
    );
  }

  inputFromHTMLElement(input: string): void {
    this.busqueda$.next(input);
  }

}
