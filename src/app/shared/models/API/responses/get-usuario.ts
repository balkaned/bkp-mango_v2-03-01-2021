/**
 * Respuesta del backend hacia el frontend del servicio para obtener usuarios
 * URL LOCAL: http://localhost:9095/getUsuario?email=ariana@gmail.com&pass=apass
 * URL PUBLICA: ???
 */
export class GetUsuario {
 
  /**
   * Siempre 0. Se recibe incluso cuando se ha consultado un usuario que no existe
   */
  idusuario_MASTER: number;
  email: string;
  ruta: string;
  estado: string;
  tipoUsuario: number;
  idusuario: number;
  usuario: string;
  /**
   * ISO 8601 string
   */
  fechacreacion: string;
  password: string;

  postulante: {
    ruta: string;
    nombres: string;
    apellidopaterno: string;
    apellidomaterno: string;
    titulo: string;
    resumen: string;
    enlace: string;
  };
  ofertante: {
    ruta: string;
    estado: string;
    tipodocumento: string;
    nrodocumento: string;
    rubro: string;
    ruc: string;
    representante: string;
    resumen: string;
    descripcionempresa: string;
  };

  postulaciones: number[];

  public static parse(raw: any): GetUsuario {
    if (raw) {
      if (raw.idusuario) {
        raw.tipoUsuario = parseInt(String(raw.tipoUsuario).valueOf().trim(), 10);
        return raw as GetUsuario;
      }
    }
    return null;
  }

}
