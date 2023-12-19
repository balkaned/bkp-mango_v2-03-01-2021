import { GetUsuario2 } from './../models/API/responses/get-usuario2';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GetUsuario } from '../models/API/responses/get-usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  // authentication: GetUsuario;
  authentication: GetUsuario2;
  loggedIn$: BehaviorSubject<boolean>;

  constructor(
  ) {
    const jsonString = localStorage.getItem('authentication');
    this.authentication = JSON.parse(jsonString);
    const loggedIn = this.authentication ? true : false;
    this.loggedIn$ = new BehaviorSubject(loggedIn);
  }

  // succesfulLogin(login: GetUsuario): any {
  //   const jsonstr = JSON.stringify(login);
  //   this.authentication = login;
  //   localStorage.setItem('authentication', jsonstr);
  //   this.loggedIn$.next(true);
  // }

  succesfulLogin(login: GetUsuario2): any {
    console.log("ENTRÓ A LOGIN EXITOSO");
    const jsonstr = JSON.stringify(login);
    this.authentication = login;
    localStorage.setItem('authentication', jsonstr);
    this.loggedIn$.next(true);
  }

  succesfulLoginv2(): any {
    // const jsonstr = JSON.stringify(login);
    // this.authentication = login;
    // localStorage.setItem('authentication', jsonstr);
    this.loggedIn$.next(true);
  }


  logout() {
    console.log(localStorage);
    localStorage.removeItem('authentication');
    console.log(localStorage);
    this.loggedIn$.next(false); 
  }

  // implementar en un futuro
  // handleAuth() => navegar a ruta de acuerdo a autentificacion (a modo de redireccion inicial)
  // _getProfile() => obtener todos los datos del usuario (permisos, etc)
}
