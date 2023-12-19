export class OfertaEmpleo {
  constructor(
    public idoferta: number = null,
    public ofertante_usuario_idusuario: number = null,
    public tituloanuncio: string = null,
    public fechapublicacion: Date = null,
    public fechafinpublicacion: Date = null,
    public anioexperiencia: string = null,
    public tipopuesto: string = null,
    public area: string = null,
    public funciones: string = null,
    public requisitos: string = null,
    public condicionlaboral: string = null,
    public fechacreacion: Date = null,
    public usuariocreador: string = null,
    public ruta: any = null,
    public resumen: string = null,
    public postulantes: number = null,
    public postulado: boolean = null,
    public ruc: string = null
  ) {}
}

