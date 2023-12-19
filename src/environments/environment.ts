export const environment = {
  production: false,
  server: null,
  api_url_list: {
    getUsuario: 'http://localhost:9095/getUsuario',
    uploadFileUsuario: 'http://localhost:9095/uploadFileUsuario',
    createUsuario: 'http://localhost:9095/createUsuario',
    validarEmail: 'http://localhost:9095/validarEmail',
    updateFotoUsuario: 'http://localhost:9095/updateFotoUsuario',
    updateDatosUsuario: 'http://localhost:9095/updateDatosUsuario',
    createOferta: 'http://localhost:9095/createOferta',
    // getAllOfertaLaboral: 'http://localhost:9095/getAllOfertaLaboral?flag=0',
    getAllOfertaLaboralByTitulo: 'http://localhost:9095/getAllByTitulo',
    getAllOfertaLaboralByOfertante: 'http://localhost:9095/getAllOfertaByOfertante',
    getOferta: 'http://localhost:9095/getOfertaLaboral',
    generalDet: 'http://localhost:9095/getAllByIdtabGeneraldet',
    uploadFilePostulante: 'http://localhost:9095/uploadFilePostulante',
    createPostulante: 'http://localhost:9095/createPostulante',
    updateFilePostulante: 'http://localhost:9095/updateFilePostulante',
    updatePostulante: 'http://localhost:9095/updateDatosPostulante',
    createPostulanteOferta: 'http://localhost:9095/createPostulanteOferta',
    uploadFileOfertante: 'http://localhost:9095/uploadFileOfertante',
    createOfertante: 'http://localhost:9095/createOfertante',
    actualizarEstadoDePostulacion: 'http://localhost:9095/updatePosXEstado',
    updateDatosOfertante: 'http://localhost:9095/updateDatosOfertante',
    updateFileOfertante: 'http://localhost:9095/updateFileOfertante',
    getPostulantesDeOferta: 'http://localhost:9095/getAllOfertaByPostulante',


    getAllOfertaLaboral: 'http://localhost:9095/ofertas'
  }
}
