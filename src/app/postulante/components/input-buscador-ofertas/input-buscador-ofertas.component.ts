import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QueryTermService } from '../../services/query-term.service';

@Component({
  selector: 'app-input-buscador-ofertas',
  templateUrl: './input-buscador-ofertas.component.html',
  styleUrls: ['./input-buscador-ofertas.component.scss']
})
export class InputBuscadorOfertasComponent {

  constructor(
    private queryTermService: QueryTermService
  ) {
  }

  onInput(input: string): void {
    this.queryTermService.inputFromHTMLElement(input);
  }

}
