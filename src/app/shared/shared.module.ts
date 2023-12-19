import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderSessionComponent } from './components/header-session/header-session.component';
import { LoginModalComponent } from './components/login-modal/login-modal.component';
import { PostulacionComponent } from './components/postulacion/postulacion.component';
import { RegistroOfertanteComponent } from './components/registro-ofertante/registro-ofertante.component';
import { TiempoDesdePipe } from './pipes/tiempo-desde.pipe';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SelectModule } from 'ng-select';


@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    HeaderSessionComponent,
    LoginModalComponent,
    PostulacionComponent,
    RegistroOfertanteComponent,
    TiempoDesdePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    SelectModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    ModalModule,
    TooltipModule,
    AlertModule,
    HeaderComponent,
    LoginModalComponent,
    PostulacionComponent,
    FooterComponent,
    RegistroOfertanteComponent,
    TiempoDesdePipe,
    SelectModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    LoginModalComponent,
    PostulacionComponent,
    RegistroOfertanteComponent
  ]
})
export class SharedModule { }
