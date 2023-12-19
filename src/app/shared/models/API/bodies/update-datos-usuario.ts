/**
 * Parametros que se envian desde el frontend hacia el backend como BODY
 * de la peticion POST para actualizar datos de usuario 'updateDatosUsuario'
 * URL LOCAL: http://localhost:9095/updateDatosUsuario
 * URL PUBLICA: ???
 */
export class UpdateDatosUsuario {
  idusuario_MASTER: number;
  estado: string;
  usuario: string;
  password: string;
  idusuario: number;
  tipoUsuario: string;
}
