/**
 * Parametros que se envian desde el frontend hacia el backend como BODY
 * de la peticion POST para actualizar datos de postulante 'updateDatosPostulante'
 * URL LOCAL: http://localhost:9095/updateDatosPostulante
 * URL PUBLICA: ???
 */
export class UpdateDatosPostulante {
    // usuario_IDUSUARIO: number;
    // nombres: string;
    // apellidopaterno: string;
    // apellidomaterno: string;
    // titulo: string;
    // resumen: string;
    // enlace: string;
 
    
    nombres: string;
    apellidos: string;
    correo: string;
    password: string;
    tipoUsuario: string;
    idusuario: number;


    idPostulante: number;
    titulo: string;
    idUsuario: number;
}
