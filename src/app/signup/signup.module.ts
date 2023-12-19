import { NgModule } from '@angular/core';

import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './components/signup/signup.component';
import { SharedModule } from '../shared/shared.module';
import { SimpleNotificationsModule, NotificationAnimationType } from 'angular2-notifications';

@NgModule({
  declarations: [SignupComponent],
  imports: [
    SignupRoutingModule,
    SharedModule,
    SimpleNotificationsModule.forRoot({
      position: ['top', 'left'],
      timeOut: 2000,
      showProgressBar: true,
      pauseOnHover: true,
      lastOnBottom: true,
      clickToClose: false,
      maxLength: 0,
      maxStack: 1,
      rtl: false,
      preventDuplicates: false,
      preventLastDuplicates: false,
      animate: NotificationAnimationType.FromRight
    })
  ]
})
export class SignupModule { }
