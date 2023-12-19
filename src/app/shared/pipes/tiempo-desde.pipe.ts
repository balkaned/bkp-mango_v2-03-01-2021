import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tiempoDesde'
})
export class TiempoDesdePipe implements PipeTransform {

  transform(value: Date): string {
    if (value === null || value === undefined) { return ''; }
    const diferencia_minutos = (((Date.now() - value.getTime()) / 1000 ) / 60 );
    if (diferencia_minutos < 1) {
      return 'hace unos instantes';
    } else if (diferencia_minutos < 60 && diferencia_minutos > 1) {
      return `hace ${Math.round(diferencia_minutos)} minutos`;
    } else {
      const diferencia_horas = diferencia_minutos / 60;
      if (diferencia_horas < 24) {
        return `hace ${Math.round(diferencia_horas)} horas`;
      } else {
        const diferencia_dias = diferencia_horas / 24;
        if (diferencia_dias < 7) {
          return `hace ${Math.round(diferencia_dias)} dias`;
        } else {
          const diferencia_semanas = diferencia_dias / 7;
          if (diferencia_semanas < 4) {
            return `hace ${Math.round(diferencia_semanas)} semanas`;
          } else {
            const diferencia_meses = diferencia_dias / 30;
            return `hace ${Math.round(diferencia_meses)} meses`;
          }
        }
      }
    }
  }

}
