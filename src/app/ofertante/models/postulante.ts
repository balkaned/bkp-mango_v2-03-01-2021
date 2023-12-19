export class Postulante {
  constructor(
    public id_usuario: number = null,
    public nombre: string = null,
    public titulo: string = null,
    public resumen: string = null,
    public telefono: string = null,
    public email: string = null,
    public estado: boolean = null,
    public foto: string = null,
    public fechapostulacion: Date = null
  ) {}
}
