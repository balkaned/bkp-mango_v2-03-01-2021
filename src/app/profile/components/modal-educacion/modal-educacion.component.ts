import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { IOption } from 'ng-select';
import { OfertasService } from 'src/app/shared/services/ofertas.service';
import { Subscription, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Oferta } from 'src/app/shared/models/oferta';
import { OfertanteService } from 'src/app/shared/services/ofertante.service';
import { Ofertante } from 'src/app/shared/models/ofertante';
import { Usuario } from 'src/app/shared/models/usuario';
import { NotificacionOfertaCreadaService } from 'src/app/ofertante/services/notificacion-oferta-creada.service';
import { Educacion } from 'src/app/shared/models/educacion';
import { PostulanteService } from 'src/app/shared/services/postulante.service';
import { Postulante } from 'src/app/shared/models/postulante';
import { NotificacionEducacionCreadaService } from 'src/app/ofertante/services/notificacion-educacion-creada.service';
import { EducacionService } from 'src/app/shared/services/educacion.service';

class OfertaInput {
  constructor(
    public posicion?,
    public resumen?,
    public direccion?,
    public salario?,
    public tipojornada?,
    public tipocontrato?,
    public requisitos?,
    public funciones?,
    public anioexperiencia?,
    public area?
  ) { }
}

@Component({
  selector: 'app-modal-educacion',
  templateUrl: './modal-educacion.component.html',
  styleUrls: ['./modal-educacion.component.scss']
})
export class ModalEducacionComponent implements OnInit {

  input: OfertaInput;
  error: OfertaInput;

  areasDisponibles: IOption[];

  registrando: boolean;

  forma: FormGroup;
  educacionModel = new Educacion();
  oferta = new Educacion();

  postulantes: Postulante[] = [];
  // private user: Usuario;

  educacion = new Educacion();

  constructor(
    public bsModalRef: BsModalRef,
    public ofertaService: OfertasService,
    public authenticationService: AuthenticationService,
    public notificacionEducacionCreadaService: NotificacionEducacionCreadaService,
    public postulanteService: PostulanteService,
    public educacionService: EducacionService
  ) {
    this.input = new OfertaInput();
    this.input.requisitos = [];
    this.input.funciones = [];
    this.error = new OfertaInput();
    this.areasDisponibles = [];
    this.registrando = false;

    this.setForma(this.educacionModel);

    
  }

  ngOnInit() {
    
  }

  public setForma(obj: Educacion) {
    console.log(this.forma);
    console.log(obj);
    this.forma = new FormGroup({
      // posicion: new FormControl(obj.posicion, Validators.required),
      titulocarrera: new FormControl(obj.titulocarrera, Validators.required),
      areaestudio: new FormControl(obj.areaestudio, Validators.required),
      tipoestudio: new FormControl(obj.tipoestudio, Validators.required),
      culminacionestado: new FormControl(obj.culminacionestado, Validators.required),
      pais: new FormControl(obj.pais, Validators.required),
      institucion: new FormControl(obj.institucion, Validators.required)
    });
  }

  // trackByFn(index, item) {
  //   return index;
  // }

  registrarEducacion() {
    this.setEducacionModel(this.educacionModel);
    console.log(this.educacionModel);


    this.guardarEducacion(this.educacionModel);


  }

  public setEducacionModel(ofertaModel: Educacion) {
    this.educacionModel.titulocarrera = this.forma.controls["titulocarrera"].value;
    this.educacionModel.areaestudio = this.forma.controls["areaestudio"].value;
    this.educacionModel.tipoestudio = this.forma.controls["tipoestudio"].value;
    this.educacionModel.culminacionestado = this.forma.controls["culminacionestado"].value;
    this.educacionModel.pais = this.forma.controls["pais"].value;
    this.educacionModel.institucion = this.forma.controls["institucion"].value;

    console.log(this.educacionModel);
  }
 
  public guardarEducacion(educacion: Educacion) {

    let peticion: Observable<any>;
    let obj = new Postulante();

    // console.log(this.user);

    this.postulanteService.getPostulantes()
      .subscribe(resp => {
        this.postulantes = resp;
        console.log(this.postulantes);
        for (let i = 0; i < this.postulantes.length; i++) {
          if (this.postulantes[i].idUsuario == this.authenticationService.authentication.idUsuario) {
            obj = this.postulantes[i];

            this.educacion.titulocarrera = educacion.titulocarrera;
            this.educacion.areaestudio = educacion.areaestudio;
            this.educacion.tipoestudio = educacion.tipoestudio;
            this.educacion.culminacionestado = educacion.culminacionestado;
            this.educacion.pais = educacion.pais;
            this.educacion.institucion = educacion.institucion;
            this.educacion.idPostulante = obj.idPostulante;


            console.log(this.educacion);
            peticion = this.educacionService.crearEducacion(this.educacion);

            peticion.subscribe(resp => {
              this.bsModalRef.hide();
              this.notificacionEducacionCreadaService.educacionCreada.next(true);
              
              console.log(resp);
            })

            
            //this.router.navigate(['/ofertante']);
            //console.log(obj);

          }
        }

      });

    console.log(this.oferta);
  }



  // registrarNuevaOferta() {
  //   const funciones = this.input.funciones.join('\n* ');
  //   const requisitos = this.input.requisitos.join('\n* ');
  //   this.registrando = true;
  //   const subscription: Subscription = this.ofertaService.createOferta(
  //     1,
  //     String(this.input.anioexperiencia).valueOf(),
  //     this.input.area,
  //     this.input.tipocontrato,
  //     funciones,
  //     this.input.posicion, 
  //     requisitos
  //   ).subscribe(
  //     (results: any) => {
  //       this.bsModalRef.hide();
  //       this.notificacionOfertaCreadaService.ofertaCreada.next(true);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }, (errors: any) => {
  //       console.log('Error al registrar nueva oferta: ', errors);
  //       if (subscription) { subscription.unsubscribe(); }
  //     }
  //   );
  // }

  getEstado(): number {
    if (
      this.input.anioexperiencia
      && this.input.area
      && this.input.tipocontrato
      && this.input.funciones.length
      && this.input.requisitos.length
      && this.input.posicion
    ) { return 1; }
    return 0;
  }

}
