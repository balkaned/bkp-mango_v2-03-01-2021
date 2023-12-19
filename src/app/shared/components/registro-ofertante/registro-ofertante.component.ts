import { Usuario } from './../../models/usuario';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { DisponibilidadEmailService } from '../../services/disponibilidad-email.service';
import { BsModalRef } from 'ngx-bootstrap';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OfertanteService } from '../../services/ofertante.service';
import { UserService } from '../../services/user.service';
import { PostulacionService } from 'src/app/postulante/services/postulacion.service';
import { AuthenticationService } from '../../services/authentication.service';
import { SessionService } from '../../services/session.service';
import { Router } from '@angular/router';
import { IOption } from 'ng-select';
import { TipoUsuario } from '../../models/tipo-usuario.enum';
import { GetUsuario } from '../../models/API/responses/get-usuario';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsuarioModel } from '../../models/usuario.models';
import { Ofertante } from '../../models/ofertante';
import { UsuarioService } from '../../services/usuario.service';
import { GetUsuario2 } from '../../models/API/responses/get-usuario2';

class RegistroOfertanteInput {
  constructor(
    public email?,
    public password?,
    public confirmPassword?,
    public ruc?,
    public representante?,
    public resumen?,
    public descripcion?,
    public fotoRepresentante?,
    public fotoLogo?,
    public archivoFotoRepresentante?,
    public archivoFotoLogo?,
    public rubro?
  ) {}
}

@Component({
  selector: 'app-registro-ofertante',
  templateUrl: './registro-ofertante.component.html',
  styleUrls: ['./registro-ofertante.component.scss']
})
export class RegistroOfertanteComponent implements OnInit {

   input: RegistroOfertanteInput;
   error: RegistroOfertanteInput;

  // email$: BehaviorSubject<string>;
  // consultaVerificacionEmail: Subscription;
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

  // rubrosDisponibles: IOption[];

  forma: FormGroup;
  usuarioModel = new UsuarioModel(); 
  usuario = new Usuario();
  ofertante = new Ofertante();

  usuarios: Usuario[] = [];

  error2: string;

  consultaLogin: Subscription;

  constructor(
    public bsModalRef: BsModalRef,
    public disponibilidadEmailService: DisponibilidadEmailService,
    public ofertanteService: OfertanteService,
    public userService: UserService,
    public postulacionService: PostulacionService,
    public authenticationService: AuthenticationService,
    public sessionService: SessionService,
    public router: Router,
    private usuarioService: UsuarioService,
  ) {
    // this.input = new RegistroOfertanteInput();
    // this.error = new RegistroOfertanteInput();
    // this.rubrosDisponibles = [];
    // this.estadoVerificacionEmail = 0;
    // this.email$ = new BehaviorSubject(null);
    // this.email$.asObservable().pipe( debounceTime(400), distinctUntilChanged() ).subscribe(
    //   (email: string) => { this.onEmailInput(email); }
    // );
    // this.registrando = false;
 
    this.setForma(this.usuarioModel);
  }

  ngOnInit() {
    // const subscription: Subscription = this.ofertanteService.getRubrosDisponibles().subscribe(
    //   (results: IOption[]) => {
    //     this.rubrosDisponibles = [...results];
    //     if (subscription) { subscription.unsubscribe(); }
    //   }, (errors: any) => {
    //     console.log('Error al obtener rubros de empresa: ' + errors);
    //     if (subscription) { subscription.unsubscribe(); }
    //   }
    // );
  }

  public setForma( usuarioModel: UsuarioModel ) {
    console.log(this.forma);
    console.log(usuarioModel);
    this.forma = new FormGroup({
      id: new FormControl(usuarioModel.id),
      nombre: new FormControl(usuarioModel.nombres, [
        Validators.required,
        Validators.minLength(3)
       // ,
        //Validators.maxLength(3)
        // ,
        // Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]),
      apellido: new FormControl(usuarioModel.apellidos, Validators.required),
      correo: new FormControl(usuarioModel.correo, Validators.required),
      clave: new FormControl(usuarioModel.password, Validators.required),
      empresa: new FormControl(usuarioModel.nombreEmpresa, Validators.required),
      telefono: new FormControl(usuarioModel.telefono, Validators.required),
      ruc: new FormControl(usuarioModel.ruc, Validators.required),
      resumen: new FormControl(usuarioModel.resumen, Validators.required),
      descripcion: new FormControl(usuarioModel.descripcion, Validators.required)
    });
  }

  guardar() {

    this.setUsuarioModel(this.usuarioModel);

    
 
    this.guardarUsuario(this.usuarioModel);
    //this.guardarOfertante(this.usuarioModel, this.usuario);

  }

  public setUsuarioModel( usuarioModel: UsuarioModel ) {
    this.usuarioModel.id = this.forma.controls["id"].value;
    this.usuarioModel.nombres = this.forma.controls["nombre"].value;
    this.usuarioModel.apellidos = this.forma.controls["apellido"].value;
    this.usuarioModel.correo = this.forma.controls["correo"].value;
    this.usuarioModel.password = this.forma.controls["clave"].value;
    this.usuarioModel.nombreEmpresa = this.forma.controls["empresa"].value;
    this.usuarioModel.telefono = this.forma.controls["telefono"].value;
    this.usuarioModel.ruc = this.forma.controls["ruc"].value;
    this.usuarioModel.resumen = this.forma.controls["resumen"].value;
    this.usuarioModel.descripcion = this.forma.controls["descripcion"].value;

    console.log(this.usuarioModel);
  }

  public guardarUsuario( usuarioModel: UsuarioModel ) {

    let self = this;
    let peticion: Observable<any>;
    
    this.usuario.nombres = usuarioModel.nombres;
    this.usuario.apellidos = usuarioModel.apellidos; 
    this.usuario.correo = usuarioModel.correo;
    this.usuario.password = usuarioModel.password;
    this.usuario.tipoUsuario = '3';

    if (this.usuario.idUsuario) { //Si existe, actualiza.
      //peticion = this.usuarioService.actualizarUsuario(this.usuario);
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
      this.guardarOfertante(this.usuarioModel, this.usuario);
    })

 

    //ESTE MÉTODO HACER EN LA VENTANA DE LOGIN
    //let objUsu =  this.getUsuario(usuarioModel.correo, usuarioModel.password)
    //console.log(objUsu);

    //this.guardarOfertante(this.usuarioModel, this.usuario);
    console.log(this.usuario);
  }

  //ESTE MÉTODO HACER EN LA VENTANA DE LOGIN
  public getUsuario(correo: string, password: string) : Usuario {
    let obj = new Usuario();

    this.usuarioService.getUsuarios()
      .subscribe( resp => {
        this.usuarios = resp;
        console.log(this.usuarios);
        for (let i = 0; i < this.usuarios.length; i++) {
          if (this.usuarios[i].correo == correo) {
            if(this.usuarios[i].password == password){
              obj = this.usuarios[i];
            console.log(obj);
            }
          }
        }
        //AQUÍ IMPLEMENTAR EL ROOT PARA QUE SE DIRIJA A OTRA PÁGINA: ESTE MÉTODO HACER EN LA VENTANA DE LOGIN
        console.log(obj);
      });
      console.log(obj);
    return obj;
  } 
 


  public guardarOfertante( usuarioModel: UsuarioModel, usuario: Usuario ) {
    this.ofertante.nombreEmpresa = usuarioModel.nombreEmpresa;
    this.ofertante.telefono = usuarioModel.telefono;
    this.ofertante.ruc = usuarioModel.ruc; 
    this.ofertante.resumen = usuarioModel.resumen;
    this.ofertante.descripcion = usuarioModel.descripcion;

    //OBTENER EL ID DE USUARIO
    this.ofertante.idUsuario = usuario.idUsuario

    let peticion: Observable<any>;

    peticion = this.ofertanteService.crearOfertante(this.ofertante);

    peticion.subscribe( resp => {
      console.log(resp);
    })

    console.log(this.ofertante);


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
  //       if (this.estadoVerificacionEmail === 4) { this.input.email = email; }
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

  // validarFotoLogo(event: {target: {files: {name: string, size: number, type: string}[]}}) {
  //   this.error.fotoLogo = null;
  //   const file = event.target.files[0];
  //   const asFloatingPoint = parseFloat(String(file.size).valueOf());
  //   const kiloBytes = (asFloatingPoint / 1024);
  //   if (kiloBytes > 32.0) {
  //     this.error.fotoLogo = `Su foto pesa ${kiloBytes.toFixed(2)}KB`;
  //   } else {
  //     this.input.fotoLogo = file.name;
  //     this.input.archivoFotoLogo = file;
  //   }
  // }

  // validarFotoRepresentante(event: {target: {files: {name: string, size: number, type: string}[]}}) {
  //   this.error.fotoRepresentante = null;
  //   const file = event.target.files[0];
  //   const asFloatingPoint = parseFloat(String(file.size).valueOf());
  //   const kiloBytes = (asFloatingPoint / 1024);
  //   if (kiloBytes > 128.0) {
  //     this.error.fotoRepresentante = `Su foto pesa ${kiloBytes.toFixed(2)}KB`;
  //   } else {
  //     this.input.fotoRepresentante = file.name;
  //     this.input.archivoFotoRepresentante = file;
  //   }
  // }

  getEstado(): number {
    if (this.registrando) { return 0; }
    if (
      this.estadoVerificacionEmail === 4
      && this.input.fotoRepresentante
      && this.input.representante
      && this.input.email
      && this.input.password
      && this.input.confirmPassword
      && this.input.fotoLogo
      && this.input.ruc
      && this.input.resumen
      && this.input.rubro
      && !this.error.password
      && !this.error.confirmPassword
      && !this.error.fotoLogo
      && !this.error.fotoRepresentante
    ) {
      return 1;
    }
    return 0;
  }

  registrarme() {
    // this.registrando = true;
    // const formDataParaFoto = new FormData();
    // console.log(this.input.archivoFotoRepresentante)
    // console.log(this.input.fotoRepresentante)
    // formDataParaFoto.append('file', this.input.archivoFotoRepresentante, this.input.fotoRepresentante);
    
    this.router.navigate(['/ofertante']);

    // const subscription: Subscription = this.userService.uploadFileUsuario(formDataParaFoto).subscribe(
    //   (id_usuario: number) => {
    //     console.log(id_usuario);
    //     this.registrarme_2(id_usuario);
    //     if (subscription) { subscription.unsubscribe(); }
    //   }, (errors: any) => {
    //     console.log('Error al crear ofertante (userService.uploadFileUsuario)', errors);
    //     if (subscription) { subscription.unsubscribe(); }
    //   }
    // );
  }

  // registrarme_2(id_usuario: number) {
  //   const subscription: Subscription = this.userService.createUsuario(
  //     id_usuario,
  //     this.input.email,
  //     this.input.password,
  //     TipoUsuario.OFERTANTE
  //   ).subscribe(
  //     (results: any) => {
  //       this.registrarme_3(id_usuario);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }, (errors: any) => {
  //       console.log('Error al crear ofertante (userService.createUsuario)', errors);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }
  //   );
  // }

  // registrarme_3(id_usuario: number) {
  //   const formDataParaFoto = new FormData();
  //   formDataParaFoto.append('file', this.input.archivoFotoLogo, this.input.fotoLogo);
  //   const subscription: Subscription = this.ofertanteService.uploadFileOfertante(
  //     id_usuario,
  //     formDataParaFoto
  //   ).subscribe(
  //     (id_usuario: number) => {
  //       this.registrarme_4(id_usuario);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }, (errors: any) => {
  //       console.log('Error al crear ofertante (ofertanteService.uploadFileOfertante)', errors);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }
  //   );
  // }

  // registrarme_4(id_usuario: number) {
  //   const subscription: Subscription = this.ofertanteService.createOfertante(
  //     id_usuario,
  //     this.input.rubro,
  //     this.input.ruc,
  //     this.input.resumen,
  //     this.input.representante,
  //     this.input.descripcion
  //   ).subscribe(
  //     (id_usuario: number) => {
  //       this.registrarme_5();
  //       if (subscription) { subscription.unsubscribe(); }
  //     }, (errors: any) => {
  //       console.log('Error al crear ofertante (ofertanteService.createOfertante)', errors);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }
  //   );
  // }

  // registrarme_5() {
  //   const consultaLogin = this.sessionService.getUserDetails(
  //     this.input.email, this.input.password
  //   ).subscribe(
  //     (sessionRawResponse: any) => {
  //       const session = GetUsuario.parse(sessionRawResponse);
  //       if (session) {
  //         this.authenticationService.succesfulLogin(session);
  //         this.bsModalRef.hide();
  //         this.router.navigate(['/ofertante']);
  //       } else {
  //         console.log('Error al iniciar sesion: Email y/o Contraseña incorrecto(s)');
  //       }
  //       if (consultaLogin) { consultaLogin.unsubscribe(); }
  //     },
  //     (errors: any) => {
  //       console.log('Error al iniciar sesion: ', errors);
  //       if (consultaLogin) { consultaLogin.unsubscribe(); }
  //     }
  //   );
  // }

}
