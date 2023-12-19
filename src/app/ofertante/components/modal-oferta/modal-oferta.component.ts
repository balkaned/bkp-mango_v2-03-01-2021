import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { IOption } from 'ng-select';
import { OfertasService } from 'src/app/shared/services/ofertas.service';
import { Subscription, Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NotificacionOfertaCreadaService } from '../../services/notificacion-oferta-creada.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Oferta } from 'src/app/shared/models/oferta';
import { OfertanteService } from 'src/app/shared/services/ofertante.service';
import { Ofertante } from 'src/app/shared/models/ofertante';
import { Usuario } from 'src/app/shared/models/usuario';

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
  selector: 'app-modal-oferta',
  templateUrl: './modal-oferta.component.html',
  styleUrls: ['./modal-oferta.component.scss']
})
export class ModalOfertaComponent implements OnInit {

  input: OfertaInput;
  error: OfertaInput;

  areasDisponibles: IOption[];

  registrando: boolean;

  forma: FormGroup;
  ofertaModel = new Oferta();
  oferta = new Oferta();

  ofertantes: Ofertante[] = [];
  // private user: Usuario;

  constructor(
    public bsModalRef: BsModalRef,
    public ofertaService: OfertasService,
    public authenticationService: AuthenticationService,
    public notificacionOfertaCreadaService: NotificacionOfertaCreadaService,
    public ofertanteService: OfertanteService,
  ) {
    this.input = new OfertaInput();
    this.input.requisitos = [];
    this.input.funciones = [];
    this.error = new OfertaInput();
    this.areasDisponibles = [];
    this.registrando = false;

    this.setForma(this.ofertaModel);

    // if (sessionStorage.getItem("user")) {
    //   this.user = JSON.parse(sessionStorage.getItem("user"));
    // } else {
    //   this.user = new Usuario();
    // }

    
  }

  ngOnInit() {
    const subscription: Subscription = this.ofertaService.obtenerAreasDeOferta().subscribe(
      (results: IOption[]) => {
        this.areasDisponibles = [...results];
        if (subscription) { subscription.unsubscribe(); }
      }, (errors: any) => {
        console.log('Error al obtener areas de oferta laboral: ' + errors);
        if (subscription) { subscription.unsubscribe(); }
      }
    );
  }

  public setForma(obj: Oferta) {
    console.log(this.forma);
    console.log(obj);
    this.forma = new FormGroup({
      posicion: new FormControl(obj.posicion, Validators.required),
      anioexperiencia: new FormControl(obj.anioexperiencia, Validators.required),
      salario: new FormControl(obj.salario, Validators.required),
      resumen: new FormControl(obj.resumen, Validators.required)
    });
  }

  // trackByFn(index, item) {
  //   return index;
  // }

  registrarOferta() {
    this.setOfertaModel(this.ofertaModel);
    console.log(this.ofertaModel);


    this.guardarOferta(this.ofertaModel);


  }

  public setOfertaModel(ofertaModel: Oferta) {
    this.ofertaModel.posicion = this.forma.controls["posicion"].value;
    this.ofertaModel.anioexperiencia = this.forma.controls["anioexperiencia"].value;
    this.ofertaModel.salario = this.forma.controls["salario"].value;
    this.ofertaModel.resumen = this.forma.controls["resumen"].value;

    console.log(this.ofertaModel);
  }
 
  public guardarOferta(ofertaModel: Oferta) {

    let peticion: Observable<any>;
    let obj = new Ofertante();

    // console.log(this.user);

    this.ofertanteService.getOfertantes()
      .subscribe(resp => {
        this.ofertantes = resp;
        console.log(this.ofertantes);
        for (let i = 0; i < this.ofertantes.length; i++) {
          if (this.ofertantes[i].idUsuario == this.authenticationService.authentication.idUsuario) {
            obj = this.ofertantes[i];

            this.oferta.posicion = ofertaModel.posicion;
            this.oferta.anioexperiencia = ofertaModel.anioexperiencia;
            this.oferta.salario = ofertaModel.salario;
            this.oferta.resumen = ofertaModel.resumen;
            this.oferta.idOfertante = obj.idOfertante;

            console.log(this.oferta);
            peticion = this.ofertaService.crearOferta(this.oferta);

            peticion.subscribe(resp => {
              this.bsModalRef.hide();
              this.notificacionOfertaCreadaService.ofertaCreada.next(true);
              
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
