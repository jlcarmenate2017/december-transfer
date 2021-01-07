import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {delay, dematerialize, materialize, mergeMap} from 'rxjs/operators';
import {CurrencyQuotationModel} from '../model/currency.quotation.model';
import {UserModel} from '../model/userModel';

const users: UserModel[] = [
  {
    id: 0,
    user: 'ejemplo1',
    password: 'ejemplo1',
    firstName: 'Ejemplo',
    lastName: 'Primero',
    listAccounts: [
      {
        accountNumber: '89022135',
        amount: 500,
        currency: 'UYU'
      }
    ]
  },
  {
    id: 1,
    user: 'ejemplo2',
    password: 'ejemplo2',
    firstName: 'Ejemplo',
    lastName: 'Segundo',
    listAccounts: [
      {
        accountNumber: '99999999',
        amount: 8000,
        currency: 'UYU'
      },
      {
        accountNumber: '33333333',
        amount: 150,
        currency: 'USD'
      },
      {
        accountNumber: '11111111',
        amount: 100,
        currency: 'EUR'
      }
    ]
  },
  {
    id: 2,
    user: 'ejemplo3',
    password: 'ejemplo3',
    firstName: 'Ejemplo',
    lastName: 'Tercero',
    listAccounts: [
      {
        accountNumber: '80808080',
        amount: 8000,
        currency: 'UYU'
      },
      {
        accountNumber: '80808088',
        amount: 150,
        currency: 'USD'
      },
      {
        accountNumber: '50055500',
        amount: 100,
        currency: 'EUR'
      }
    ]
  },
  {
    id: 3,
    user: 'ejemplo4',
    password: 'ejemplo4',
    firstName: 'Ejemplo',
    lastName: 'Cuarto',
    listAccounts: [
      {
        accountNumber: '8085285958',
        amount: 8000,
        currency: 'UYU'
      },
      {
        accountNumber: '8909809080',
        amount: 150,
        currency: 'USD'
      },
      {
        accountNumber: '560560500',
        amount: 100,
        currency: 'EUR'
      }
    ]
  }
];

const currencies: CurrencyQuotationModel[] = [
  {
    internalCurrency: 'USD',
    referenceCurrency: 'UYU',
    quote: 42.50
  },
  {
    internalCurrency: 'EUR',
    referenceCurrency: 'UYU',
    quote: 55
  },
  {
    internalCurrency: 'UYU',
    referenceCurrency: 'USD',
    quote: 0.0236228
  },
  {
    internalCurrency: 'EUR',
    referenceCurrency: 'USD',
    quote: 1.2299
  },
  {
    internalCurrency: 'UYU',
    referenceCurrency: 'EUR',
    quote: 0.0136228
  },
  {
    internalCurrency: 'USD',
    referenceCurrency: 'EUR',
    quote: 0.8299
  }
];

@Injectable({
  providedIn: 'root'
})
export class MockBackend implements HttpInterceptor {
  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const {url, method, headers, body} = request;

    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(500))
      .pipe(dematerialize());

    function handleRoute() {
      switch (true) {
        case url.endsWith('/users/authenticate') && method === 'POST':
          return authenticate();
        case url.endsWith('/users') && method === 'GET':
          return getUsers();
        case url.endsWith('/getQuotation') && method === 'POST':
          return getQuotation();
        case url.endsWith('/confirmTransaction') && method === 'POST':
          return transferOk();
        case url.endsWith('/currentUser') && method === 'GET':
          return getCurrentUsers();
        case url.endsWith('/usersWithOutMe') && method === 'GET':
          return getUsersWithOutMe();
        default:
          // pass through any requests not handled above
          return next.handle(request);
      }
    }

    function authenticate() {
      const {username, password} = body;
      const user = users.find(x => x.user === username && x.password === password);
      if (!user) {
        return error('Usuario o contraseña incorrectos');
      }

      return ok({...user, token: 'fake-jwt-tokentest'});
    }

    function getUsers() {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      return ok(users);
    }

    function getQuotation() {
      const {currency, referenceCurrency} = body;
      const data = currencies.find(x => x.internalCurrency === currency && x.referenceCurrency === referenceCurrency);
      if (!data) {
        return error('Quotation not exist');
      }

      return ok({...data});
    }

    function getCurrentUsers() {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      return ok(JSON.parse(localStorage.getItem('currentUser')));
    }

    function getUsersWithOutMe() {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      const currentUser: UserModel = JSON.parse(localStorage.getItem('currentUser'));
      return ok(users.filter(x => x.id !== currentUser.id));
    }

    function transferOk() {
      if (!isLoggedIn()) {
        return unauthorized();
      }
      return ok();
    }

    function ok(bodyData?) {
      return of(new HttpResponse({status: 200, body: bodyData}));
    }

    function error(message) {
      return throwError({error: {message}});
    }

    function unauthorized() {
      return throwError({status: 401, error: {message: 'Unauthorised'}});
    }

    function isLoggedIn() {
      const currentUser: UserModel = JSON.parse(localStorage.getItem('currentUser'));
      return headers.get('Authorization') === 'Bearer ' + currentUser.token;
    }
  }
}
