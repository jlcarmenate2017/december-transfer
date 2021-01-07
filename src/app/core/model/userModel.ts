import {AccountBank} from './account.bank';


export class UserModel {
  id: number;
  token?: string;
  user: string;
  password: string;
  firstName: string;
  lastName: string;
  listAccounts: AccountBank[];

}
