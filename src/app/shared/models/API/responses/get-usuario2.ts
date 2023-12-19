/**
 * Respuesta del backend hacia el frontend del servicio para obtener usuarios
 * URL LOCAL: http://localhost:9095/getUsuario?email=ariana@gmail.com&pass=apass
 * URL PUBLICA: ???
 */
export class GetUsuario2 {

  /**
   * Siempre 0. Se recibe incluso cuando se ha consultado un usuario que no existe
   */
  idUsuario: number;
  nombres: string;
  apellidos: string;
  correo: string;
  password: string;
  tipoUsuario: string;

  postulante: {
    idPostulante: number;
    titulo: string;
    idUsuario: number;
  };

  ofertante: {
    idOfertante: number;
    nombreEmpresa: string; 
    telefono: string;
    ruc: string;
    resumen: string;
    descripcion: string;
    idUsuario: number;
  };

  postulaciones: number[];
  /**
   * ISO 8601 string
   */


  public static parse(raw: any): GetUsuario2 {
    console.log("Entró a GETUSUARIO 2");
    if (raw) {
      if (raw.idUsuario) {
        //raw.tipoUsuario = parseInt(String(raw.tipoUsuario).valueOf().trim(), 10);
        return raw as GetUsuario2;
      }
    }
    return null;
  }

}
