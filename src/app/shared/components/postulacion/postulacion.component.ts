import { PostulanteService } from 'src/app/shared/services/postulante.service';
import { Component, ApplicationRef, OnInit } from '@angular/core';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { DisponibilidadEmailService } from '../../services/disponibilidad-email.service';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { PostulacionService } from 'src/app/postulante/services/postulacion.service';
import { AuthenticationService } from '../../services/authentication.service';
import { TipoUsuario } from '../../models/tipo-usuario.enum';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';
import { GetUsuario } from '../../models/API/responses/get-usuario';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../services/usuario.service';
import { Postulante } from '../../models/postulante';
import { UsuarioPostulanteModel } from '../../models/usuariopostulante.models';
import { GetUsuario2 } from '../../models/API/responses/get-usuario2';

class PostulacionInput {
  constructor(
    public email?,
    public password?,
    public confirmPassword?,
    public titulo?,
    public file?,
    public linkedin?,
    public resumen?,
    public archivoFoto?,
    public fileCV?,
    public fileFoto?
  ) {}
}

@Component({
  selector: 'app-postulacion',
  templateUrl: './postulacion.component.html',
  styleUrls: ['./postulacion.component.scss']
})
export class PostulacionComponent implements OnInit {

  ngOnInit(): void {
    
  }

  input: PostulacionInput;
  error: PostulacionInput;

  email$: BehaviorSubject<string>;
  consultaVerificacionEmail: Subscription; 
  /**
   * 0 => El usuario aun no ha tocado el email, por lo tanto a pesar de no ser
   * un email correcto, no se debe mostrar ningun error.
   *
   * 1 => El email no tiene un formato valido, no se puede preguntar aun al servidor si esta
   * disponible, se muestra error de email parece incorrecto
   *
   * 2 => El email tiene un formato valido, pero aun no se ha verificado si esta disponible
   * o no, se muestra normal sin mensaje de error ni borde de colores
   *
   * 3 => El email no esta disponible. Se muestra un mensaje de error muy especial
   *
   * 4 => El email esta disponible. Se muestra con contorno verde en señal de aprobacion
   */
  estadoVerificacionEmail: 0 | 1 | 2 | 3 | 4;

  registrando: boolean;

  forma: FormGroup;
  usuarioPostulanteModel = new UsuarioPostulanteModel();
  usuario = new Usuario();

  postulante = new Postulante();

  error2: string;

  consultaLogin: Subscription;

  constructor(
    public bsModalRef: BsModalRef,
    public options: ModalOptions,
    public disponibilidadEmailService: DisponibilidadEmailService,
    public userService: UserService,
    public postulacionService: PostulacionService,
    public authenticationService: AuthenticationService,
    public sessionService: SessionService,
    public router: Router,
    public appRef: ApplicationRef,
    private usuarioService: UsuarioService,
    public postulanteService: PostulanteService
  ) {
    // this.estadoVerificacionEmail = 0;
    // this.registrando = false;
    // this.input = new PostulacionInput();
    // this.error = new PostulacionInput();
    // this.error.file = 'No ha seleccionado un archivo aun';
    // this.email$ = new BehaviorSubject(null);
    // this.email$.asObservable().pipe( debounceTime(400), distinctUntilChanged() ).subscribe(
    //   (email: string) => { this.onEmailInput(email); }
    // );
    this.setForma(this.usuarioPostulanteModel);
  }

  public setForma( usuarioPostulanteModel: UsuarioPostulanteModel ) {
    console.log(this.forma);
    console.log(usuarioPostulanteModel);
    this.forma = new FormGroup({
      id: new FormControl(usuarioPostulanteModel.id),
      nombre: new FormControl(usuarioPostulanteModel.nombres, [
        Validators.required,
        Validators.minLength(3)
       // ,
        //Validators.maxLength(3)
        // ,
        // Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]),
      apellido: new FormControl(usuarioPostulanteModel.apellidos, Validators.required),
      titulo: new FormControl(usuarioPostulanteModel.titulo, Validators.required),
      correo: new FormControl(usuarioPostulanteModel.correo, Validators.required),
      clave: new FormControl(usuarioPostulanteModel.password, Validators.required)
    });
  }

  guardar() {

    this.setUsuarioPostulanteModel(this.usuarioPostulanteModel);

    

    this.guardarUsuario(this.usuarioPostulanteModel);
    //this.guardarOfertante(this.UsuarioPostulanteModel, this.usuario);

  }

  public setUsuarioPostulanteModel( UsuarioPostulanteModel: UsuarioPostulanteModel ) {
    this.usuarioPostulanteModel.id = this.forma.controls["id"].value;
    this.usuarioPostulanteModel.nombres = this.forma.controls["nombre"].value;
    this.usuarioPostulanteModel.apellidos = this.forma.controls["apellido"].value;
    this.usuarioPostulanteModel.titulo = this.forma.controls["titulo"].value;
    this.usuarioPostulanteModel.correo = this.forma.controls["correo"].value;
    this.usuarioPostulanteModel.password = this.forma.controls["clave"].value;
    

    console.log(this.usuarioPostulanteModel);
  }

  public guardarUsuario( UsuarioPostulanteModel: UsuarioPostulanteModel ) {

    let peticion: Observable<any>;
    
    this.usuario.nombres = UsuarioPostulanteModel.nombres;
    this.usuario.apellidos = UsuarioPostulanteModel.apellidos;
    this.usuario.correo = UsuarioPostulanteModel.correo;
    this.usuario.password = UsuarioPostulanteModel.password;
    this.usuario.tipoUsuario = '2';

    if (this.usuario.idUsuario) { //Si existe, actualiza.
      // peticion = this.usuarioService.actualizarUsuario(this.usuario);
        // .subscribe(resp => {
        //   console.log(resp);
        // });

    } else { //Si no existe, registra.
      peticion = this.usuarioService.crearUsuario(this.usuario); 
        // .subscribe(resp => {
        //   console.log(resp);
        //   this.heroe = resp; //La respuesta es un héroe(retorna el servicio un objeto héroe).
        // });
    }

    peticion.subscribe( resp => {
      console.log(resp);
      this.guardarPostulante(this.usuarioPostulanteModel, this.usuario);
    })

    

    //this.guardarOfertante(this.UsuarioPostulanteModel, this.usuario);
    console.log(this.usuario);
  }

  public guardarPostulante( usuarioPostulanteModel: UsuarioPostulanteModel, usuario: Usuario ) {
    this.postulante.titulo = usuarioPostulanteModel.titulo;

    //OBTENER EL ID DE USUARIO
    this.postulante.idUsuario = usuario.idUsuario

    let peticion: Observable<any>;

    peticion = this.postulanteService.crearPostulante(this.postulante);

    peticion.subscribe( resp => {
      console.log(resp);
    })

    console.log(this.postulante);


    this.error2 = null;
    this.consultaLogin = this.sessionService.getUserDetails(
      this.usuario.correo, this.usuario.password 
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
          this.error2 = 'Email y/o contraseña incorrecto(s)';
        }
        if (this.consultaLogin) { this.consultaLogin.unsubscribe(); }
      },
      (errors: any) => {
        this.error2 = 'Error de conexión por favor nuevamente en unos instantes';
        console.log('Error al iniciar sesion: ', errors);
        if (this.consultaLogin) { this.consultaLogin.unsubscribe(); }
      }
    );


  }

  // onEmailInput(email: string) {
  //   this.error.email = null;
  //   if (email === undefined || email === null) { return; }
  //   if (email.trim() === '') { return; }
  //   const emailRegex = new RegExp(
  //     // tslint:disable-next-line: max-line-length
  //     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  //   );
  //   if (!emailRegex.test(email)) {
  //     this.estadoVerificacionEmail = 1;
  //     this.error.email = 'Por favor ingrese una dirección de correo electrónico válida';
  //     return;
  //   }
  //   this.onEmailInput_2(email);
  // }

  // private onEmailInput_2(email: string) {
  //   this.estadoVerificacionEmail = 2;
  //   if (this.consultaVerificacionEmail) { this.consultaVerificacionEmail.unsubscribe(); }
  //   this.consultaVerificacionEmail = this.disponibilidadEmailService.verificarDisponibilidad(
  //     email.trim()
  //   ).subscribe(
  //     (results: boolean) => {
  //       this.estadoVerificacionEmail = results ? 3 : 4;
  //       if (this.consultaVerificacionEmail) { this.consultaVerificacionEmail.unsubscribe(); }
  //     }, (errors: any) => {
  //       console.log('Error al consultar disponibilidad de email: ', errors);
  //       if (this.consultaVerificacionEmail) { this.consultaVerificacionEmail.unsubscribe(); }
  //     }
  //   );
  // }

  // validarPassword(password: string) {
  //   this.error.password = null;
  //   if (!password || password === '') {
  //     this.error.password = 'Al menos 6 caracteres';
  //   } else {
  //     const length = password.trim().length;
  //     if (length < 6) {
  //       this.error.password = 'Al menos 6 caracteres';
  //     } else if (length > 32) {
  //       this.error.password = 'No mas de 32 caracteres';
  //     }
  //   }
  // }

  // validarConfirmacion(password: string) {
  //   if (this.error.password === undefined) { return; }
  //   this.error.confirmPassword =
  //     this.input.password === this.input.confirmPassword ? null :
  //     'La contraseña debe coincidir';
  // }

  // validarCV(event: {target: {files: {name: string, size: number, type: string}[]}}) {
  //   this.error.file = null;
  //   const file = event.target.files[0];
  //   const asFloatingPoint = parseFloat(String(file.size).valueOf());
  //   const megaBytes = (asFloatingPoint / 1024) / 1024;
  //   if (megaBytes > 2.0) {
  //     this.error.file = `Su CV pesa ${megaBytes.toFixed(2)}MB`;
  //   } else {
  //     this.input.file = file.name;
  //     this.input.fileCV = file;
  //   }
  // }

  // validarFoto(event: {target: {files: {name: string, size: number, type: string}[]}}) {
  //   this.error.archivoFoto = null;
  //   const file = event.target.files[0];
  //   const asFloatingPoint = parseFloat(String(file.size).valueOf());
  //   const kiloBytes = (asFloatingPoint / 1024);
  //   if (kiloBytes > 128.0) {
  //     this.error.archivoFoto = `Su foto pesa ${kiloBytes.toFixed(2)}KB`;
  //   } else {
  //     this.input.archivoFoto = file.name;
  //     this.input.fileFoto = file;
  //   }
  // }

  getEstado(): number {
    if (this.registrando) { return 0; }
    if (
      this.estadoVerificacionEmail === 4
      && this.input.password
      && this.input.confirmPassword
      && this.input.file
      && this.input.archivoFoto
      && this.input.titulo
      && this.input.fileCV
      && this.input.fileFoto
      && !this.error.password
      && !this.error.confirmPassword
      && !this.error.file
      && !this.error.archivoFoto
    ) {
      return 1;
    }
    return 0;
  }

  // registrarme() {
  //   this.registrando = true;
  //   this.input.email = this.email$.value;
  //   const formDataParaFoto = new FormData();
  //   formDataParaFoto.append('file', this.input.fileFoto, this.input.fileFoto.name);
  //   const subscription: Subscription = this.userService.uploadFileUsuario(formDataParaFoto).subscribe(
  //     (id_usuario: number) => {
  //       this.registrarme_2(id_usuario);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }, (errors: any) => {
  //       console.log('Error al realizar postulacion (userService.uploadFileUsuario)', errors);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }
  //   );
  // }

  // registrarme_2(id_usuario: number) {
  //   const subscription: Subscription = this.userService.createUsuario(
  //     id_usuario,
  //     this.input.email,
  //     this.input.password,
  //     TipoUsuario.POSTULANTE
  //   ).subscribe(
  //     (results: any) => {
  //       this.registrarme_3(id_usuario);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }, (errors: any) => {
  //       console.log('Error al realizar postulacion (userService.createUsuario)', errors);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }
  //   );
  // }

  // registrarme_3(id_usuario: number) {
  //   const formDataParaCV = new FormData();
  //   formDataParaCV.append('file', this.input.fileCV, this.input.fileCV.name);
  //   const subscription: Subscription = this.postulacionService.subirCVPostulante(
  //     id_usuario,
  //     formDataParaCV
  //   ).subscribe(
  //     (results: any) => {
  //       this.registrarme_4(id_usuario);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }, (errors: any) => {
  //       console.log('Error al realizar postulacion (postulacionService.subirCVPostulante)', errors);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }
  //   );
  // }

  // registrarme_4(id_usuario: number) {
  //   const subscription: Subscription = this.postulacionService.createPostulante(
  //     id_usuario,
  //     this.input.titulo,
  //     this.input.resumen,
  //     this.input.linkedin
  //   ).subscribe(
  //     (results: any) => {
  //       this.registrarme_5();
  //       if (subscription) { subscription.unsubscribe(); }
  //     }, (errors: any) => {
  //       console.log('Error al realizar postulacion (postulacionService.createPostulante)', errors);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }
  //   );
  // }

  // registrarme_5() {
  //   const consultaLogin = this.sessionService.getUserDetails(
  //     this.input.email, this.input.password
  //   ).subscribe(
  //     (results: GetUsuario) => {
  //       if (results === null) {
  //         console.log('Error al iniciar sesion: Email y/o Contraseña incorrecto(s)');
  //       } else {
  //         this.authenticationService.succesfulLogin(results);
  //         if (this.options) {
  //           if (this.options.initialState) {
  //             if (this.options.initialState['oferta']) {
  //               this.registrarme_6();
  //               return;
  //             }
  //           }
  //         }
  //         this.redireccionar();
  //       }
  //       if (consultaLogin) { consultaLogin.unsubscribe(); }
  //     },
  //     (errors: any) => {
  //       console.log('Error al iniciar sesion: ', errors);
  //       if (consultaLogin) { consultaLogin.unsubscribe(); }
  //     }
  //   );
  // }

  // registrarme_6() {
  //   const idoferta = this.options.initialState['oferta'].idoferta;
  //   const subscription: Subscription = this.postulacionService.postularAOferta(
  //     idoferta,
  //     this.authenticationService.authentication.idusuario
  //   ).subscribe(
  //     (results: any) => {
  //       this.options.initialState['oferta'].postulado = true;
  //       if (this.authenticationService.authentication.postulaciones) {
  //         this.authenticationService.authentication.postulaciones.push(idoferta);
  //       } else {
  //         this.authenticationService.authentication.postulaciones = [idoferta];
  //       }
  //       this.registrando = false;
  //       this.bsModalRef.hide();
  //       this.appRef.tick();
  //     }, (errors: any) => {
  //       console.log('Error al postular en oferta (postulacionService.postularAOferta): ', errors);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }
  //   );
  // }

  // redireccionar() {
  //   if (!this.authenticationService.loggedIn$.value) { return; }
  //   if (this.authenticationService.authentication.tipoUsuario === TipoUsuario.OFERTANTE) {
  //     this.router.navigate(['/ofertante']);
  //   } else if (this.authenticationService.authentication.tipoUsuario === TipoUsuario.POSTULANTE) {
  //     this.router.navigate(['/']);
  //   }
  //   this.bsModalRef.hide();
  // }

}
