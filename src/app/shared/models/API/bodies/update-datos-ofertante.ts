/**
 * Parametros que se envian desde el frontend hacia el backend como BODY
 * de la peticion POST para actualizar datos de ofertante 'updateDatosOfertante'
 * URL LOCAL: http://localhost:9095/updateDatosOfertante
 * URL PUBLICA: ???
 */
export class UpdateDatosOfertante {
  nombres: string;
  apellidos: string;
  correo: string;
  password: string;
  tipoUsuario: string;
  idusuario: number;


  idOfertante: number;
  nombreEmpresa: string; 
  telefono: string;
  ruc: string;
  resumen: string;
  descripcion: string;
  idUsuario: number;

    
}
