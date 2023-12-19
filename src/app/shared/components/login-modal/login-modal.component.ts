import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { AuthenticationService } from '../../services/authentication.service';
import { SessionService } from '../../services/session.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { TipoUsuario } from '../../models/tipo-usuario.enum';
import { GetUsuario } from '../../models/API/responses/get-usuario';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { UsuarioModel } from '../../models/usuario.models';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GetUsuario2 } from '../../models/API/responses/get-usuario2';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.scss']
})
export class LoginModalComponent implements OnInit {

  email: string;
  password: string;

  error: string;

  consultaLogin: Subscription;

  forma: FormGroup;
  usuarios: Usuario[] = [];
  usuarioModel = new UsuarioModel();

  obj2 = new Usuario();

  constructor(
    public bsModalRef: BsModalRef,
    public authenticationService: AuthenticationService,
    public sessionService: SessionService,
    public router: Router,
    private usuarioService: UsuarioService
  ) {
    this.email = null;
    this.password = null;

    this.setForma(this.usuarioModel);

  }

  ngOnInit() {}

  public setForma( usuarioModel: UsuarioModel ) {
    console.log(this.forma);
    console.log(usuarioModel);
    this.forma = new FormGroup({
      correo: new FormControl(usuarioModel.correo, Validators.required),
      clave: new FormControl(usuarioModel.password, Validators.required)
    });
  }

  iniciarSesion() {

    //ESTE MÉTODO HACER EN LA VENTANA DE LOGIN
     this.setUsuarioModel(this.usuarioModel);
    // console.log(this.usuarioModel);
    // let objUsu =  this.getUsuario(this.usuarioModel.correo, this.usuarioModel.password)
    // console.log(objUsu);



    //LOGIN DE USUARIO con web service
    this.error = null;
    this.consultaLogin = this.sessionService.getUserDetails(
      this.usuarioModel.correo, this.usuarioModel.password
    ).subscribe(
      (sessionRawResponse: any) => {
        const session = GetUsuario2.parse(sessionRawResponse);
        console.log(session);
        if (session) {
          this.authenticationService.succesfulLogin(session);
          console.log(this.authenticationService.authentication.tipoUsuario);
          if (this.authenticationService.authentication.tipoUsuario === TipoUsuario.OFERTANTE+"") {
            this.router.navigate(['/ofertante']);
          } else if (this.authenticationService.authentication.tipoUsuario === TipoUsuario.POSTULANTE+"") {
            this.router.navigate(['/']);
          }
          this.bsModalRef.hide();
          this.bsModalRef.hide();
        } else {
          this.error = 'Email y/o contraseña incorrecto(s)';
        }
        if (this.consultaLogin) { this.consultaLogin.unsubscribe(); }
      },
      (errors: any) => {
        this.error = 'Error de conexión por favor nuevamente en unos instantes';
        console.log('Error al iniciar sesion: ', errors);
        if (this.consultaLogin) { this.consultaLogin.unsubscribe(); }
      }
    );
  }

  public setUsuarioModel( usuarioModel: UsuarioModel ) {
    this.usuarioModel.correo = this.forma.controls["correo"].value;
    this.usuarioModel.password = this.forma.controls["clave"].value;

    console.log(this.usuarioModel);
  }

  get estado(): number {
    if (this.consultaLogin) {
      return this.consultaLogin.closed ? 1 : 0;
    }
    return 1;
  }

  public getUsuario(correo: string, password: string) : Usuario {
    let obj = new Usuario();

    this.usuarioService.getUsuario(correo, password)
    .subscribe(resp => {
      let obj = new Usuario();
      console.log(resp);
      obj = resp;
      console.log(obj);

      if(obj != null){
        console.log("Ingresó aquí")
        this.authenticationService.succesfulLoginv2();
              if (obj.tipoUsuario === '3') { 
                this.router.navigate(['/ofertante']);
                sessionStorage.setItem('user',JSON.stringify(obj)); 
                //Cierra el modal
                this.bsModalRef.hide();
              } else if (obj.tipoUsuario === '2') {
                this.router.navigate(['/']);
                
                //Cierra el modal
                this.bsModalRef.hide();
              }
      }
    });

      console.log(this.obj2);
    return this.obj2;
  } 

}
