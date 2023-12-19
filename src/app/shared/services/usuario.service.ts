import { UsuarioModel } from './../models/usuario.models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, delay } from 'rxjs/operators';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url = 'http://localhost:9095';

  constructor( private http: HttpClient) {


  }

  crearUsuario( usuario: Usuario) {

    //Retorna el Id de héroe, esto es un método observable
    return this.http.post(`${ this.url }/usuarios`, usuario)
            .pipe(
              //Método "pipe" de los observables
              map( (resp:any) => {
                //El map recibe la respuesta de la petición, lo que responda http.post en este caso (Id)
                usuario.idUsuario = resp.idUsuario;
                return usuario; //Retorna el héroe ya manipulado (una instancia)
              })
            );

    //El operador "map" transforma lo que un observable puede regresar
  }

  actualizarUsuario( usuario: Usuario ) {

    //Creo una constante temporal que almacenará los datos de Héroe
    const usuarioTemp = {
      ...usuario
    };

    //El id de héroe temporal lo elimino
    //delete usuarioTemp.idUsuario;

    return this.http.put(`${ this.url }/usuarios`, usuarioTemp);
  }

  borrarUsuario( id: string ) {

    return this.http.delete(`${ this.url }/usuarios/${ id }`)

  }

  getUsuario( correo: string, password: string ) : Observable<Usuario> {
    return this.http.get<Usuario>( `${ this.url }/usuarios/obtenerUsuarioPorEmailYPassword?correo=${correo}&password=${password}` )
  }

  private crearArregloUsuario( usuariosObj: object ) {

    let usuarios = new Usuario();

    //Hago un recorrido de obj y le asigno un "key"
    Object.keys( usuariosObj ).forEach( key => {

      //Extraigo el objeto y lo asigno a una referencia
      const usuario: Usuario = usuariosObj[key];

      //usuario.id = key;

      //Almaceno los héroes en el arreglo
      usuarios = usuario ;

    });

    //Si no hay información en la base de datos
    if ( usuariosObj === null ) { return ''; }

    return usuarios;
  }

  getUsuarios() { 
    return this.http.get(`${ this.url }/usuarios`)
            .pipe(
              map( this.crearArreglo ),
              delay(1500)
            );
  }

  private crearArreglo( usuariosObj: object ) {

    const usuarios: Usuario[] = [];

    //Hago un recorrido de obj y le asigno un "key"
    Object.keys( usuariosObj ).forEach( key => {

      //Extraigo el objeto y lo asigno a una referencia
      const usuario: Usuario = usuariosObj[key];

      //usuario.id = key;

      //Almaceno los héroes en el arreglo
      usuarios.push( usuario );

    });

    //Si no hay información en la base de datos
    if ( usuariosObj === null ) { return []; }

    return usuarios;
  }

}
