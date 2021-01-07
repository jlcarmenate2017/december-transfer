import {UserModel} from './userModel';
import {AccountBank} from './account.bank';

export class TransactionModel {
  numberAccountDest?: string;
  amount?: number;
  amountSend?: number;
  amountChange?: string;
  quotation?: string;
  currencyQuotation?: string;
  observations?: string;
  userDest?: UserModel;
  userOrig?: UserModel;
  accountOrig?: AccountBank;
  accountDest?: AccountBank;
}
