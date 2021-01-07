import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {JwtInterceptor} from './interceptors/jwt.interceptor';
import {MockBackend} from './interceptors/mock-backend';
import {UserService} from '../home/services/user.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MockBackend,
      multi: true
    },
    UserService
  ]
})
export class CoreModule { }
