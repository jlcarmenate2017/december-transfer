import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private http: HttpClient) {
  }

  confirmTransaction() {
    return this.http.post<any>(`${environment.api}/confirmTransaction`, {});
  }

}
