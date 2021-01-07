import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserService} from './services/user.service';
import {TransferComponent} from './components/transfer/transfer.component';
import {InfoComponent} from './components/info/info.component';
import {CoreModule} from '../core/core.module';
import {AngularMaterialModule} from '../angular-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule,
    AngularMaterialModule,
    FlexLayoutModule
  ],
  declarations: [
    InfoComponent,
    TransferComponent,
  ], providers: [
    UserService
  ]

})
export class HomeModule {
}
