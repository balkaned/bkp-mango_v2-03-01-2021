// import { Component, OnInit, Output, EventEmitter } from '@angular/core';
// import { NotificationsService } from 'angular2-notifications';

// @Component({
//   selector: 'app-filtros-ofertas',
//   templateUrl: './filtros-ofertas.component.html',
//   styleUrls: ['./filtros-ofertas.component.scss']
// })
// export class FiltrosOfertasComponent {

//   items: {id_filtro: string, nombre: string, tipo: number}[][];
//   items_seleccionados: {id_filtro: string, nombre: string, tipo: number}[];
//   categorias: {tipo: number, nombre: string}[];
//   expandido: boolean[];
//   itemsSeleccionados: Set<string>;

//   @Output() filtroChange: EventEmitter<{idFiltro: string, checked: boolean}>;
//   @Output() error: EventEmitter<{title: string, message: string}>;

//   constructor(
//     public notificationsService: NotificationsService
//   ) {
//     this.items = [];
//     this.categorias = [];
//     this.items_seleccionados = [];
//     this.itemsSeleccionados = new Set();
//     this.filtroChange = new EventEmitter();
//     this.error = new EventEmitter();
//   }

//   /*ngOnInit() {
//     const subscription = this.filtrosOfertasService.readAll().subscribe(
//       (results: {id_filtro: string, nombre: string, tipo: number}[]) => {
//         this.items = [
//           results.filter( result => result.tipo === 1 ),
//           results.filter( result => result.tipo === 2 ),
//           results.filter( result => result.tipo === 3 )
//         ];
//         this.expandido = [false, false, false];
//         this.categorias = [
//           { nombre: 'Área', tipo: 1 },
//           { nombre: 'Cargo', tipo: 2 },
//           { nombre: 'Ubicación', tipo: 3 },
//         ];
//         if (subscription) { subscription.unsubscribe(); }
//       }, (errors: any) => {
//         this.error.emit({
//           title: 'Fallo al obtener los filtros de ofertas',
//           message: JSON.stringify(errors, null, 2)
//         });
//         if (subscription) { subscription.unsubscribe(); }
//       }
//     );
//   }*/

//   onItemChange(idFiltro: string, checked: boolean) {
//     const before = this.itemsSeleccionados.size;
//     checked ? this.itemsSeleccionados.add(idFiltro) : this.itemsSeleccionados.delete(idFiltro);
//     if (this.itemsSeleccionados.size !== before) { this.filtroChange.emit({idFiltro, checked}); }
//   }

//   seleccionar(item: {id_filtro: string, nombre: string, tipo: number}): void {
//     for (const existing of this.items_seleccionados) {
//       if (item.id_filtro === existing.id_filtro) {
//         return;
//       }
//     }
//     const nuevosItems = this.items_seleccionados.slice(0);
//     nuevosItems.push(item);
//     this.items_seleccionados = nuevosItems;
//   }

//   eliminar(item: {id_filtro: string, nombre: string, tipo: number}): void {
//     for (let i = 0; i < this.items_seleccionados.length; i++) {
//       if (this.items_seleccionados[i].id_filtro === item.id_filtro) {
//         this.items_seleccionados.splice(i, 1);
//         return;
//       }
//     }
//   }

// }














import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { FiltrosOfertasService } from '../../services/filtros-ofertas.service';

@Component({
  selector: 'app-filtros-ofertas',
  templateUrl: './filtros-ofertas.component.html',
  styleUrls: ['./filtros-ofertas.component.scss']
})
export class FiltrosOfertasComponent implements OnInit {

  items: {id_filtro: string, nombre: string, tipo: number}[][];
  categorias: {tipo: number, nombre: string}[];
  itemsSeleccionados: Set<string>;

  @Output() filtroChange: EventEmitter<{idFiltro: string, checked: boolean}>;
  @Output() error: EventEmitter<{title: string, message: string}>;

  constructor(
    public filtrosOfertasService: FiltrosOfertasService,
    public notificationsService: NotificationsService
  ) {
    this.items = [];
    this.categorias = [];
    this.itemsSeleccionados = new Set();
    this.filtroChange = new EventEmitter();
    this.error = new EventEmitter();
  }

  ngOnInit() {
    const subscription = this.filtrosOfertasService.readAll().subscribe(
      /**
       * Se debe cambiar el codigo, para que se ajuste al backend
       * Posiblemente deban obtenerse los distintos nombres de tipos que
       * actualmente se estan colocando en duro
       */
      (results: {id_filtro: string, nombre: string, tipo: number}[]) => {
        this.items = [
          results.filter( result => result.tipo === 1 ),
          results.filter( result => result.tipo === 2 ),
          results.filter( result => result.tipo === 3 )
        ];
        this.categorias = [
          { nombre: 'Área', tipo: 1 },
          { nombre: 'Cargo', tipo: 2 },
          { nombre: 'Ubicación', tipo: 3 },
        ];
        if (subscription) { subscription.unsubscribe(); }
      }, (errors: any) => {
        this.error.emit({
          title: 'Fallo al obtener los filtros de ofertas',
          message: JSON.stringify(errors, null, 2)
        });
        if (subscription) { subscription.unsubscribe(); }
      }
    );
  }

  onItemChange(idFiltro: string, checked: boolean) {
    const before = this.itemsSeleccionados.size;
    checked ? this.itemsSeleccionados.add(idFiltro) : this.itemsSeleccionados.delete(idFiltro);
    if (this.itemsSeleccionados.size !== before) { this.filtroChange.emit({idFiltro, checked}); }
  }

}

