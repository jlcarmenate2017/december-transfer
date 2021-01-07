import {Component, OnInit, ViewChild} from '@angular/core';

import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {CustomValidatorService} from '../../../core/directive/custom.validator.service';
import {MatStepper} from '@angular/material/stepper';
import {StepperSelectionEvent} from '@angular/cdk/stepper';
import {timer} from 'rxjs';
import {map} from 'rxjs/operators';
import {QuoterService} from '../../services/quoter.service';
import {CurrencyQuotationModel} from '../../../core/model/currency.quotation.model';
import {AccountBank} from '../../../core/model/account.bank';
import {UserService} from '../../services/user.service';
import {TransactionModel} from '../../../core/model/TransactionModel';
import {TransactionService} from '../../services/transaction.service';
import {UserModel} from '../../../core/model/userModel';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss'],
})
export class TransferComponent implements OnInit {
  account: any;
  currentUser: UserModel;
  sendData: any;
  disableData: boolean;
  listAccount: AccountBank[] = [];
  transferForm: FormGroup;
  confirmForm: FormGroup;
  @ViewChild('stepper') private myStepper: MatStepper;
  private selectedIndex = 0;
  private listAllAccount: UserModel[];
  transactionModel: TransactionModel = new TransactionModel();
  accountOrig: AccountBank;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private transactionService: TransactionService,
              private quoterService: QuoterService) {
    this.transferForm = this.formBuilder.group(this.controlsConfig(false));
    this.confirmForm = this.formBuilder.group(this.controlsConfig(true));
    this.onValueChangeAccount();
  }

  ngOnInit() {
    this.userService.getAllWithOutMe().subscribe(userArray => {
      this.listAllAccount = userArray;
    });
    this.userService.getCurrentUser().subscribe((user: UserModel) => {
      this.currentUser = user;
      this.listAccount = user.listAccounts;
    });
  }

  private controlsConfig(disable: boolean) {
    return {
      numberAccountDest: [{
        value: '',
        disabled: disable
      }, [Validators.required, CustomValidatorService.OnlyNumberValidation], this.accountDataValidator.bind(this)],
      amount: [{
        value: '',
        disabled: disable
      }, [Validators.required, CustomValidatorService.FloatNumberValidation]],
      amountChange: [{value: '', disabled: true}],
      quotation: [{value: '', disabled: true}],
      currencyQuotation: [{value: '', disabled: true}],
      observations: [{
        value: '',
        disabled: disable
      }, [Validators.maxLength(255)]]
    };
  }

  setIndex($event: StepperSelectionEvent) {
    this.selectedIndex = $event.selectedIndex;
  }

  triggerClick() {
    if (this.selectedIndex === 1) {
      this.buildDataForm(this.transferForm, this.confirmForm);
    }
  }

  buildDataForm(transferForm: FormGroup, confirmForm: FormGroup) {
    const userModel = this.getUserDataFromValue(transferForm.get('numberAccountDest').value);
    Object.assign(this.transactionModel, {
      numberAccountDest: transferForm.get('numberAccountDest').value,
      amount: transferForm.get('amount').value,
      amountChange: transferForm.get('amountChange').value,
      observations: transferForm.get('observations').value,
      quotation: transferForm.get('quotation').value,
      currencyQuotation: transferForm.get('currencyQuotation').value,
      userDest: userModel,
      accountDest: this.getAccountDataFromValue(userModel, transferForm.get('numberAccountDest').value),
      accountOrig: this.accountOrig,
      userOrig: this.currentUser
    });
    confirmForm.setValue({
      numberAccountDest: transferForm.get('numberAccountDest').value,
      amount: transferForm.get('amount').value,
      amountChange: transferForm.get('amountChange').value,
      observations: transferForm.get('observations').value,
      quotation: transferForm.get('quotation').value,
      currencyQuotation: transferForm.get('currencyQuotation').value,
    });
  }

  accountDataValidator({value}: AbstractControl): ValidationErrors {
    return timer(1).pipe(
      map(() => {
        return (!this.getUserDataFromValue(value) ? {accountNotExist: true} : null);
      })
    );
  }

  getUserDataFromValue(value) {
    return this.listAllAccount.find((userModel: UserModel) => {
      return this.getAccountDataFromValue(userModel, value);
    });
  }

  private onValueChangeAccount() {
    this.transferForm.controls.numberAccountDest.valueChanges.subscribe(() => {
      this.createConversion();
    });
    this.transferForm.controls.amount.valueChanges.subscribe(() => {
      this.createConversion();
    });
  }

  public createConversion() {
    const amount = this.transferForm.get('amount').value;
    const accountDestValue = this.transferForm.get('numberAccountDest').value;
    const userDest = this.getUserDataFromValue(accountDestValue);

    if (!amount) {
      return;
    }
    if (amount && this.accountOrig && !userDest) {
      this.currencyAccount(this.accountOrig, 1, amount);
    }
    if (amount && this.accountOrig && userDest) {
      const accountDest: AccountBank = this.getAccountDataFromValue(userDest, accountDestValue);
      if (accountDest.currency !== this.accountOrig.currency && this.accountOrig.amount >= amount) {
        this.quoterService.getQuotation(this.accountOrig.currency, accountDest.currency).subscribe((quotation: CurrencyQuotationModel) => {
          const quote = Math.round(amount * quotation.quote * 100) / 100;
          this.setAmount(quote, accountDest.currency);
          this.setQuotation(quotation.quote, accountDest.currency);
        });
      } else {
        this.currencyAccount(this.accountOrig, 1, amount);
      }
    }
  }

  currencyAccount(accountBank: AccountBank, quotation: number, amount: number) {
    if (accountBank.amount >= amount) {
      this.setAmount(amount, accountBank.currency);
      this.setQuotation(quotation, accountBank.currency);
    } else {
      this.transferForm.get('amount').setErrors({amountToLong: true});
      this.transferForm.get('amountChange').setValue('');
      this.setQuotation(quotation, accountBank.currency);
    }
  }

  private setAmount(amount, currency) {
    this.transferForm.get('amountChange').setValue(amount + ' ' + currency);
    this.transactionModel.amountSend = amount;
  }

  private setQuotation(quotation, currency) {
    this.transferForm.get('currencyQuotation').setValue(currency);
    this.transferForm.get('quotation').setValue(quotation);
  }

  getAccountDataFromValue(accountDest: UserModel, value) {
    return accountDest.listAccounts.find(account => {
      return account.accountNumber === value;
    });
  }

  onConfirmTransaction() {
    this.transactionService.confirmTransaction().subscribe(() => {
      this.myStepper.next();
    });

  }

  onTerminate() {
    this.accountOrig = new AccountBank();
    this.transactionModel = new TransactionModel();
    this.myStepper.reset();
  }
}
