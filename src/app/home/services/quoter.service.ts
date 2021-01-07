import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CurrencyQuotationModel} from '../../core/model/currency.quotation.model';

@Injectable({
  providedIn: 'root'
})
export class QuoterService {

  constructor(private http: HttpClient) {
  }

  getQuotation(currency, referenceCurrency) {
    return this.http.post<CurrencyQuotationModel>(`${environment.api}/getQuotation`, {currency, referenceCurrency});
  }
}
