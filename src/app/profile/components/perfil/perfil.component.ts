import { NotificacionEducacionCreadaService } from 'src/app/ofertante/services/notificacion-educacion-creada.service';
import { Ofertante } from 'src/app/shared/models/ofertante';
import { UsuarioService } from './../../../shared/services/usuario.service';
import { ModalEducacionComponent } from './../modal-educacion/modal-educacion.component';
import { Component, OnInit, AfterViewInit, ApplicationRef } from '@angular/core';
import { DisponibilidadEmailService } from 'src/app/shared/services/disponibilidad-email.service';
import { UserService } from 'src/app/shared/services/user.service';
import { PostulacionService } from 'src/app/postulante/services/postulacion.service';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SessionService } from 'src/app/shared/services/session.service';
import { TipoUsuario } from 'src/app/shared/models/tipo-usuario.enum';
import { UpdateDatosPostulante } from 'src/app/shared/models/API/bodies/update-datos-postulante';
import { UpdateDatosOfertante } from 'src/app/shared/models/API/bodies/update-datos-ofertante';
import { Subscription } from 'rxjs';
import { GetUsuario } from 'src/app/shared/models/API/responses/get-usuario';
import { NotificationsService } from 'angular2-notifications';
import { OfertanteService } from 'src/app/shared/services/ofertante.service';
import { IOption } from 'ng-select';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/shared/models/usuario';
import { GetUsuario2 } from 'src/app/shared/models/API/responses/get-usuario2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalOfertaComponent } from 'src/app/ofertante/components/modal-oferta/modal-oferta.component';
import { ModalExperienciaLaboralComponent } from '../modal-experiencia-laboral/modal-experiencia-laboral.component';
import { NotificacionExperienciaLaboralCreadaService } from 'src/app/ofertante/services/notificacion-experiencia-laboral-creada.service';
import { Postulante } from 'src/app/shared/models/postulante';
import { PostulanteService } from 'src/app/shared/services/postulante.service';
import { ExperienciaLaboralService } from 'src/app/shared/services/experiencialaboral.service';
import { ExperienciaLaboral } from 'src/app/shared/models/experiencia-laboral';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Educacion } from 'src/app/shared/models/educacion';
import { EducacionService } from 'src/app/shared/services/educacion.service';
 
@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent implements OnInit, AfterViewInit {

  postulante: UpdateDatosPostulante;
  ofertante: UpdateDatosOfertante;

  nuevaFoto: any;
  nuevoCV: any;
  nuevoLogo: any;
  rubrosDisponibles: IOption[];

  private user: Usuario;
  
  modalNuevaOferta: BsModalRef;

  experienciaslaborales: ExperienciaLaboral[];
  educaciones: Educacion[];
  consultando: boolean;

  forma: FormGroup;
  forma2: FormGroup;

  usuario_postulante = new UpdateDatosPostulante();

  objPostulante = new Postulante();
  objOfertante = new Ofertante();
  objUsuario = new Usuario();

  constructor(
    public disponibilidadEmailService: DisponibilidadEmailService,
    public userService: UserService,
    public postulacionService: PostulacionService,
    public authenticationService: AuthenticationService,
    public sessionService: SessionService,
    public notificationsService: NotificationsService,
    public ofertanteService: OfertanteService,
    public appRef: ApplicationRef,
    public router: Router,
    private modalService: BsModalService,
    public notificacionExperienciaLaboralCreadaService: NotificacionExperienciaLaboralCreadaService,
    public postulanteService: PostulanteService,
    public experienciaLaboralService: ExperienciaLaboralService,
    public usuarioService: UsuarioService,
    public educacionService: EducacionService,
    public notificacionEducacionCreadaService: NotificacionEducacionCreadaService
  ) {
    this.postulante = { 
      nombres: null,
      apellidos: null,
      correo: null,
      password: null,
      tipoUsuario: null,
      idusuario: null,
      idPostulante: null,
      titulo: null,
      idUsuario: null
    };
    this.ofertante = {
      nombres: null,
      apellidos: null,
      correo: null,
      password: null,
      tipoUsuario: null,
      idusuario: null,
      idOfertante: null,
      nombreEmpresa: null, 
      telefono: null,
      ruc: null,
      resumen: null,
      descripcion: null,
      idUsuario: null
    };
    this.consultando = true;

    this.setForma(this.postulante, this.ofertante);
  }

  ngOnInit() {

    const subscription: Subscription = this.ofertanteService.getRubrosDisponibles().subscribe(
      (results: IOption[]) => {
        this.rubrosDisponibles = [...results];
        if (subscription) { subscription.unsubscribe(); }
      }, (errors: any) => {
        console.log('Error al obtener rubros de empresa: ' + errors);
        if (subscription) { subscription.unsubscribe(); }
      }
    );
    this.authenticationService.loggedIn$.subscribe(
      (loggedIn: boolean) => {
        if (loggedIn) {
          Promise.resolve(null).then(() => { this.appRef.tick(); });
        } else {
          this.router.navigate(['/']);
        }
      }
    );

    this.consultando = false;
    
    // if (sessionStorage.getItem("user")) {
    //   this.user = JSON.parse(sessionStorage.getItem("user"));
    // } else {
    //   this.user = new Usuario();
    // }

    // console.log(this.user);

    this.notificacionExperienciaLaboralCreadaService.experienciaLaboralCreada.subscribe(
      (results: boolean) => {
        if (results === true) {
          this.ngAfterViewInit();
        }
      }
    );
    this.notificacionEducacionCreadaService.educacionCreada.subscribe(
      (results: boolean) => {
        if (results === true) {
          this.ngAfterViewInit();
        }
      }
    );
  }

  ngAfterViewInit() {
    Promise.resolve(null).then(() => { this.inicializarDatosDePerfil(); });
    Promise.resolve(null).then( () => {
      /*const subscription: Subscription = this.ofertasService.ofertasDeEmpleador(
        this.authenticationService.authentication.userData.idusuario
      ).subscribe(*/

        // let arg = this.user.idUsuario+'';
        
        this.postulanteService.getPostulante(this.authenticationService.authentication.idUsuario+"")
        .subscribe(resp => {
          let objPostulante = new Postulante();
          console.log(resp);
          objPostulante = resp;
          console.log(objPostulante);

          if(objPostulante != null){
            console.log("Ingresó aquí")
            
            const subscription: Subscription = this.experienciaLaboralService.getExperienciaLaboral(objPostulante.idPostulante)
            .subscribe(
                (resultados: ExperienciaLaboral[]) => {
                  this.experienciaslaborales = [...resultados];
                  console.log(this.experienciaslaborales); 
        
        
                  this.notificacionExperienciaLaboralCreadaService.experienciaLaboralCreada.next(false); 
                  this.consultando = false;
                  if (subscription) { subscription.unsubscribe(); }
                }, (errors: any) => {
                  this.notificationsService.error('Fallo al buscar ofertas', 'Error Inesperado');
                  console.log('Fallo al buscar ofertas: ', errors);
                  if (subscription) { subscription.unsubscribe(); }
                }
              );

          }
        });

        this.postulanteService.getPostulante(this.authenticationService.authentication.idUsuario+"")
        .subscribe(resp => {
          let objPostulante = new Postulante();
          console.log(resp);
          objPostulante = resp;
          console.log(objPostulante);

          if(objPostulante != null){
            console.log("Ingresó aquí")
            
            const subscription: Subscription = this.educacionService.getEducaciones(objPostulante.idPostulante)
            .subscribe(
                (resultados: Educacion[]) => {
                  this.educaciones = [...resultados];
                  console.log(this.experienciaslaborales); 
        
        
                  this.notificacionEducacionCreadaService.educacionCreada.next(false); 
                  this.consultando = false;
                  if (subscription) { subscription.unsubscribe(); }
                }, (errors: any) => {
                  this.notificationsService.error('Fallo al buscar ofertas', 'Error Inesperado');
                  console.log('Fallo al buscar ofertas: ', errors);
                  if (subscription) { subscription.unsubscribe(); }
                }
              );

          }
        });



        this.ofertanteService.getOfertante(this.authenticationService.authentication.idUsuario+"")
        .subscribe(resp => {
          let objOfertante = new Ofertante();
          console.log(resp);
          objOfertante = resp;
          console.log(objOfertante);

        });
        

        
    } );
  }

  public setForma( usuario_postulante: UpdateDatosPostulante, usuario_ofertante: UpdateDatosOfertante ) {
    console.log(this.forma);
    console.log(usuario_postulante);
    this.forma = new FormGroup({
      nombres: new FormControl(usuario_postulante.nombres, Validators.required),
      apellidos: new FormControl(usuario_postulante.apellidos, Validators.required),
      correo: new FormControl(usuario_postulante.correo, Validators.required),
      password: new FormControl(usuario_postulante.password, Validators.required),
      titulo: new FormControl(usuario_postulante.titulo, Validators.required)
    });

    console.log(this.forma2);
    console.log(usuario_ofertante);
    this.forma2 = new FormGroup({
      nombres: new FormControl(usuario_ofertante.nombres, Validators.required),
      apellidos: new FormControl(usuario_ofertante.apellidos, Validators.required),
      correo: new FormControl(usuario_ofertante.correo, Validators.required),
      password: new FormControl(usuario_ofertante.password, Validators.required),
      nombreEmpresa: new FormControl(usuario_ofertante.nombreEmpresa, Validators.required),
      telefono: new FormControl(usuario_ofertante.telefono, Validators.required),
      ruc: new FormControl(usuario_ofertante.ruc, Validators.required),
      resumen: new FormControl(usuario_ofertante.resumen, Validators.required),
      descripcion: new FormControl(usuario_ofertante.descripcion, Validators.required)
    });
  }

  inicializarDatosDePerfil() {

    // if (sessionStorage.getItem("user")) {
    //   this.user = JSON.parse(sessionStorage.getItem("user"));
    // } else {
    //   this.user = new Usuario();
    // }

    
    console.log(this.user);
    const postulante = this.authenticationService.authentication.postulante;
    if (postulante) {
      this.postulante = {
        nombres: this.authenticationService.authentication.nombres,
        apellidos: this.authenticationService.authentication.apellidos,
        correo: this.authenticationService.authentication.correo,
        password: this.authenticationService.authentication.password,
        tipoUsuario: this.authenticationService.authentication.tipoUsuario,
        idusuario: this.authenticationService.authentication.idUsuario,
        idPostulante: this.authenticationService.authentication.postulante.idPostulante,
        titulo: this.authenticationService.authentication.postulante.titulo,
        idUsuario: this.authenticationService.authentication.postulante.idUsuario
      };
    }
 
    console.log(this.authenticationService.authentication.ofertante);
    const ofertante = this.authenticationService.authentication.ofertante;
    if (ofertante) {
      this.ofertante = {
        nombres: this.authenticationService.authentication.nombres,
        apellidos: this.authenticationService.authentication.apellidos,
        correo: this.authenticationService.authentication.correo,
        password: this.authenticationService.authentication.password,
        tipoUsuario: this.authenticationService.authentication.tipoUsuario,
        idusuario: this.authenticationService.authentication.idUsuario,
        idOfertante: this.authenticationService.authentication.ofertante.idOfertante,
        nombreEmpresa: this.authenticationService.authentication.ofertante.nombreEmpresa,
        telefono: this.authenticationService.authentication.ofertante.telefono,
        ruc: this.authenticationService.authentication.ofertante.ruc,
        resumen: this.authenticationService.authentication.ofertante.resumen,
        descripcion: this.authenticationService.authentication.ofertante.descripcion,
        idUsuario: this.authenticationService.authentication.ofertante.idUsuario

      };
    }

    this.setForma(this.postulante, this.ofertante);
    
  }

  getNombre(): string {
    if (!this.authenticationService) { return ''; }
    if (!this.authenticationService.authentication) { return ''; }

    switch (this.authenticationService.authentication.tipoUsuario) {
      case TipoUsuario.POSTULANTE+"":
        const nombreCompleto =
          this.authenticationService.authentication.nombres 
          + ' ' + this.authenticationService.authentication.apellidos;
        return nombreCompleto;
      // case TipoUsuario.OFERTANTE+"":
      //   return this.authenticationService.authentication.ofertante.representante;
      default:
        return '';
    }
  }

  getTitulo(): string {
    if (!this.authenticationService) { return ''; }
    if (!this.authenticationService.authentication) { return ''; }
    switch (this.authenticationService.authentication.tipoUsuario) {
      case TipoUsuario.POSTULANTE+"":
        return this.authenticationService.authentication.postulante.titulo;
      case TipoUsuario.OFERTANTE+"":
        return 'Representante Empresarial';
      default:
        return '';
    }
  }

  // getFoto(): string {
  //   const def = './assets/img/image-placeholder.png';
  //   if (!this.authenticationService) { return def; }
  //   if (!this.authenticationService.authentication) { return def; }
  //   return this.authenticationService.authentication.ruta ? this.authenticationService.authentication.ruta : def;
  // }

  esEmpresa(): boolean {
    
    // if (this.user.tipoUsuario === '3') {
    //   return true;
    // }
    if (this.authenticationService) {
      if (this.authenticationService.authentication) {
        if (this.authenticationService.authentication.tipoUsuario === TipoUsuario.OFERTANTE+"") {
          return true;
        }
      }
    }
    return false;
  }

  validarFoto(event: { target: { files: { name: string, size: number, type: string }[] } }) {
    const file = event.target.files[0];
    const asFloatingPoint = parseFloat(String(file.size).valueOf());
    const kiloBytes = (asFloatingPoint / 1024);
    if (kiloBytes > 128.0) {
      this.notificationsService.error('Foto no aceptada', `Su foto pesa ${kiloBytes.toFixed(2)}KB y debe ser menor a 128KB`);
    } else {
      this.nuevaFoto = file;
      this.actualizarFotoDeUsuario(this.authenticationService.authentication.idUsuario);
    }
  }

  validarCV(event: { target: { files: { name: string, size: number, type: string }[] } }) {
    const file = event.target.files[0];
    const asFloatingPoint = parseFloat(String(file.size).valueOf());
    const megaBytes = (asFloatingPoint / 1024) / 1024;
    if (megaBytes > 2.0) {
      this.notificationsService.error('CV no aceptado', `Su CV pesa ${megaBytes.toFixed(2)}MB y debe ser menor a 2MB`);
    } else {
      this.nuevoCV = file;
      this.actualizarCVDeUsuario(this.authenticationService.authentication.idUsuario);
    }
  }

  validarLogo(event: { target: { files: { name: string, size: number, type: string }[] } }) {
    const file = event.target.files[0];
    const asFloatingPoint = parseFloat(String(file.size).valueOf());
    const kiloBytes = (asFloatingPoint / 1024);
    if (kiloBytes > 32.0) {
      this.notificationsService.error('Logo no Aceptado', `Su Logo pesa ${kiloBytes.toFixed(2)}KB y debe ser menor a 32KB`);
    } else {
      this.nuevoLogo = file;
      this.actualizarLogoDeEmpresa(this.authenticationService.authentication.idUsuario);
    }
  }

  esPostulante(): boolean {
    // console.log(this.user)
    // if (this.user.tipoUsuario === '2') {
    //   return true;
    // }
    if (this.authenticationService) {
      if (this.authenticationService.authentication) {
        if (this.authenticationService.authentication.tipoUsuario === TipoUsuario.POSTULANTE+"") {
          return true;
        }
      }
    }
    return false;
  }

  // getLogo(): string {
  //   const def = './assets/img/image-placeholder.png';
  //   if (!this.authenticationService) { return def; }
  //   if (!this.authenticationService.authentication) { return def; }
  //   return this.authenticationService.authentication.ofertante.ruta ? this.authenticationService.authentication.ofertante.ruta : def;
  // }

  // getNombreEmpresa(): string {
  //   if (!this.authenticationService) { return ''; }
  //   if (!this.authenticationService.authentication) { return ''; }
  //   return this.authenticationService.authentication.ofertante ? this.authenticationService.authentication.ofertante.ruc : '';
  // }

  // getDescripcionEmpresa(): string {
  //   if (!this.authenticationService) { return ''; }
  //   if (!this.authenticationService.authentication) { return ''; }
  //   return this.authenticationService.authentication.ofertante ?
  //     this.authenticationService.authentication.ofertante.descripcionempresa : '';
  // }

  actualizarFotoDeUsuario(id_usuario: number) {
    const formData = new FormData();
    formData.append('file', this.nuevaFoto, this.nuevaFoto.name);
    const subscription: Subscription = this.userService.updateFotoUsuario(
      id_usuario,
      formData
    ).subscribe(
      (results: any) => {
        this.notificationsService.success('Exito', 'Se ha actualizado tu foto de perfil');
        this.actualizarDatos();
        if (subscription) { subscription.unsubscribe(); }
      }, (errors: any) => {
        console.log('Error en userService.updateFotoUsuario: ', errors);
        if (subscription) { subscription.unsubscribe(); }
      }
    );
  }

  actualizarCVDeUsuario(id_usuario: number) {
    const formData = new FormData();
    formData.append('file', this.nuevoCV, this.nuevoCV.name);
    const subscription: Subscription = this.postulacionService.updateFilePostulante(
      id_usuario,
      formData
    ).subscribe(
      (results: any) => {
        this.notificationsService.success('Exito', 'Se ha actualizado tu CV');
        this.actualizarDatos();
        if (subscription) { subscription.unsubscribe(); }
      }, (errors: any) => {
        console.log('Error en postulacionService.updateFilePostulante:', errors);
        if (subscription) { subscription.unsubscribe(); }
      }
    );
  }

  actualizarLogoDeEmpresa(id_usuario: number) {
    const formData = new FormData();
    formData.append('file', this.nuevoLogo, this.nuevoLogo.name);
    const subscription: Subscription = this.ofertanteService.updateFileOfertante(
      id_usuario,
      formData
    ).subscribe(
      (results: any) => {
        this.notificationsService.success('Exito', 'Se ha actualizado tu Logo Empresarial');
        this.actualizarDatos();
        if (subscription) { subscription.unsubscribe(); }
      }, (errors: any) => {
        console.log('Error en ofertanteService.updateFileOfertante:', errors);
        if (subscription) { subscription.unsubscribe(); }
      }
    );
  }

  actualizarDatos() {
    const consulta = this.sessionService.getUserDetails(
      this.authenticationService.authentication.correo,
      this.authenticationService.authentication.password
    ).subscribe(
      (sessionRawResponse: any) => {
        const session = GetUsuario2.parse(sessionRawResponse);
        if (session) {
          this.authenticationService.succesfulLogin(session);
        }
        if (consulta) { consulta.unsubscribe(); }
      }
    );
  }

  updateOfertante() {

    console.log(this.ofertante);
    console.log(this.objOfertante);
    this.setOfertanteModel(this.ofertante);
    

    const subscription: Subscription =
      this.ofertanteService.updateDatosOfertante(this.objOfertante).subscribe(
        (results: any) => {
          // this.actualizarDatos();
          // this.notificationsService.success('Exito', 'Se han actualizado tus datos');
          if (subscription) { subscription.unsubscribe(); }
        }
      );


      this.setUsuarioModel2(this.ofertante);
      console.log(this.objUsuario);

      const subscription2: Subscription =
      this.usuarioService.actualizarUsuario(this.objUsuario).subscribe(
        (results: any) => {
          this.actualizarDatos();
          this.notificationsService.success('Exito', 'Se han actualizado tus datos');
          if (subscription2) { subscription2.unsubscribe(); }
        }
      );

  }

  updatePostulante() {

    console.log(this.postulante);
    console.log(this.objPostulante);
    this.setPostulanteModel(this.postulante);
    console.log(this.objPostulante);

    const subscription: Subscription =
      this.postulacionService.updatePostulante(this.objPostulante).subscribe(
        (results: any) => {
          //this.actualizarDatos();
          //this.notificationsService.success('Exito', 'Se han actualizado tus datos');
          if (subscription) { subscription.unsubscribe(); }
        }
      );

      this.setUsuarioModel(this.postulante);
      console.log(this.objUsuario);

      const subscription2: Subscription =
      this.usuarioService.actualizarUsuario(this.objUsuario).subscribe(
        (results: any) => {
          this.actualizarDatos();
          this.notificationsService.success('Exito', 'Se han actualizado tus datos');
          if (subscription2) { subscription2.unsubscribe(); }
        }
      );

      
  }

  public setPostulanteModel( postulanteModel: UpdateDatosPostulante ) {
    this.objPostulante.titulo = this.forma.controls["titulo"].value;
    this.objPostulante.idPostulante = postulanteModel.idPostulante;
    this.objPostulante.idUsuario = postulanteModel.idUsuario;

  }

  public setOfertanteModel( ofertanteModel: UpdateDatosOfertante ) {
    console.log(this.forma2.controls);
    this.objOfertante.nombreEmpresa = this.forma2.controls["nombreEmpresa"].value;
    this.objOfertante.telefono = this.forma2.controls["telefono"].value;
    this.objOfertante.ruc = this.forma2.controls["ruc"].value;
    this.objOfertante.resumen = this.forma2.controls["resumen"].value;
    this.objOfertante.descripcion = this.forma2.controls["descripcion"].value;
    this.objOfertante.idOfertante = ofertanteModel.idOfertante;
    this.objOfertante.idUsuario = ofertanteModel.idUsuario;

  }

  public setUsuarioModel( postulanteModel: UpdateDatosPostulante ) {
    this.objUsuario.nombres = this.forma.controls["nombres"].value;
    this.objUsuario.apellidos = this.forma.controls["apellidos"].value;
    this.objUsuario.correo = this.forma.controls["correo"].value;
    this.objUsuario.password = this.forma.controls["password"].value;
    this.objUsuario.tipoUsuario = postulanteModel.tipoUsuario;
    this.objUsuario.idUsuario = postulanteModel.idusuario;

  }

  public setUsuarioModel2( ofertanteModel: UpdateDatosOfertante ) {
    this.objUsuario.nombres = this.forma2.controls["nombres"].value;
    this.objUsuario.apellidos = this.forma2.controls["apellidos"].value;
    this.objUsuario.correo = this.forma2.controls["correo"].value;
    this.objUsuario.password = this.forma2.controls["password"].value;
    this.objUsuario.tipoUsuario = ofertanteModel.tipoUsuario;
    this.objUsuario.idUsuario = ofertanteModel.idusuario;

  }

  nuevaExperienciaLaboral(event?) { 
    this.modalNuevaOferta = this.modalService.show(ModalExperienciaLaboralComponent, {class: 'modal-lg'});
  }

  nuevaEducacion(event?) {
    this.modalNuevaOferta = this.modalService.show(ModalEducacionComponent, {class: 'modal-lg'});
  }



}
