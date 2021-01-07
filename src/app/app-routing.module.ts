import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/components/login/login.component';
import {AuthGuard} from './core/helpers/auth.guard';
import {InfoComponent} from './home/components/info/info.component';
import {TransferComponent} from './home/components/transfer/transfer.component';

const appRoutes: Routes = [
  { path: '', component: TransferComponent, canActivate: [AuthGuard] },
  { path: 'info', component: InfoComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
