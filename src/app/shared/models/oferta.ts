
export class Oferta {
    idOferta: number;
    posicion: string;
    anioexperiencia: number;
    salario: number;
    resumen: string;
    idOfertante: number;
    postulantes: number;

    constructor(
        public postulado: boolean = null
    ) { }

}
