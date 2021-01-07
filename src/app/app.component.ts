import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {LoginService} from './login/services/login.service';
import {UserModel} from './core/model/userModel';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: UserModel;

  constructor(
    private router: Router,
    private loginService: LoginService,
  ) {
    this.loginService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
