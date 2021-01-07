import {FormControl} from '@angular/forms';
import {Injectable} from '@angular/core';

@Injectable()
export class CustomValidatorService {

  constructor() { }

  static FloatNumberValidation(control: FormControl) {
    if (control.value) {
      const matches = control.value.match(/^([0-9]*[.])?[0-9]+$/);
      return matches ? null : { regexValidation: true };
    } else {
      return null;
    }
  }
  static OnlyNumberValidation(control: FormControl) {
    if (control.value) {
      const matches = control.value.match(/^[0-9]+$/);
      return matches ? null : { regexValidation: true };
    } else {
      return null;
    }
  }
}
