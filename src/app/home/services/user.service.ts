import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {UserModel} from '../../core/model/userModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  getAll() {
    return this.http.get<UserModel[]>(`${environment.api}/users`);
  }

  getCurrentUser() {
    return this.http.get<UserModel>(`${environment.api}/currentUser`);
  }

  getAllWithOutMe() {
    return this.http.get<UserModel[]>(`${environment.api}/usersWithOutMe`);
  }
}
