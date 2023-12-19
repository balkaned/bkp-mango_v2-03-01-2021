import { ExperienciaLaboralService } from './../../../shared/services/experiencialaboral.service';
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
import { ExperienciaLaboral } from 'src/app/shared/models/experiencia-laboral';
import { NotificacionExperienciaLaboralCreadaService } from 'src/app/ofertante/services/notificacion-experiencia-laboral-creada.service';
import { PostulanteService } from 'src/app/shared/services/postulante.service';
import { Postulante } from 'src/app/shared/models/postulante';

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
  selector: 'app-modal-experiencia-laboral',
  templateUrl: './modal-experiencia-laboral.component.html',
  styleUrls: ['./modal-experiencia-laboral.component.scss']
})
export class ModalExperienciaLaboralComponent implements OnInit {

  input: OfertaInput;
  error: OfertaInput;

  areasDisponibles: IOption[];

  registrando: boolean;

  forma: FormGroup;
  experienciaLaboralModel = new ExperienciaLaboral();
  experienciaLaboral = new ExperienciaLaboral();

  postulantes: Postulante[] = [];
  // private user: Usuario;

  constructor(
    public bsModalRef: BsModalRef,
    public ofertaService: OfertasService,
    public authenticationService: AuthenticationService,
    public notificacionExperienciaLaboralCreadaService: NotificacionExperienciaLaboralCreadaService,
    public ofertanteService: OfertanteService,
    public postulanteService: PostulanteService,
    public experienciaLaboralService: ExperienciaLaboralService
  ) {
    this.input = new OfertaInput();
    this.input.requisitos = [];
    this.input.funciones = [];
    this.error = new OfertaInput();
    this.areasDisponibles = [];
    this.registrando = false;

    this.setForma(this.experienciaLaboralModel);

    
  }

  ngOnInit() {
    
  }

  public setForma(obj: ExperienciaLaboral) {
    console.log(this.forma);
    console.log(obj);
    this.forma = new FormGroup({
      // posicion: new FormControl(obj.posicion, Validators.required),
      empresa: new FormControl(obj.empresa, Validators.required),
      puesto: new FormControl(obj.puesto, Validators.required),
      nivelexperiencia: new FormControl(obj.nivelexperiencia, Validators.required),
      descripcionresponsabilidades: new FormControl(obj.descripcionresponsabilidades, Validators.required)
    });
  }

  // trackByFn(index, item) {
  //   return index;
  // }

  registrarExperienciaLaboral() { 
    this.setOfertaModel(this.experienciaLaboralModel);
    console.log(this.experienciaLaboralModel);


    this.guardarExperienciaLaboral(this.experienciaLaboralModel);


  }

  public setOfertaModel(ofertaModel: ExperienciaLaboral) {
    this.experienciaLaboralModel.empresa = this.forma.controls["empresa"].value;
    this.experienciaLaboralModel.puesto = this.forma.controls["puesto"].value;
    this.experienciaLaboralModel.nivelexperiencia = this.forma.controls["nivelexperiencia"].value;
    this.experienciaLaboralModel.descripcionresponsabilidades = this.forma.controls["descripcionresponsabilidades"].value;

    console.log(this.experienciaLaboralModel);
  }
 
  public guardarExperienciaLaboral(experienciaLaboralModel: ExperienciaLaboral) {

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

            this.experienciaLaboral.empresa = experienciaLaboralModel.empresa;
            this.experienciaLaboral.puesto = experienciaLaboralModel.puesto;
            this.experienciaLaboral.nivelexperiencia = experienciaLaboralModel.nivelexperiencia;
            this.experienciaLaboral.descripcionresponsabilidades = experienciaLaboralModel.descripcionresponsabilidades;
            this.experienciaLaboral.idPostulante = obj.idPostulante;

            console.log(this.experienciaLaboral); 
            peticion = this.experienciaLaboralService.crearExperienciaLaboral(this.experienciaLaboral);

            peticion.subscribe(resp => {
              this.bsModalRef.hide();
              this.notificacionExperienciaLaboralCreadaService.experienciaLaboralCreada.next(true);
              
              console.log(resp);
            })

            
            //this.router.navigate(['/ofertante']);
            //console.log(obj);

          }
        }

      });

    console.log(this.experienciaLaboral);
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
