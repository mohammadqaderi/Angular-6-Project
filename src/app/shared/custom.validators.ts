import { AbstractControl } from '@angular/forms';

export class CustomValidators {
  // Custom Validation for emailControl
  static emailDomain(domainName: string) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const email: string = control.value;
      
      const domain = email.substring(email.lastIndexOf("@") + 1);
      if (email === "" || domain.toLowerCase() === domainName.toLowerCase()) {
        return null;
      } else {
        return { emailDomain: true };
      }
    };
  }

   // Check if the email and the confirm email are equal or not
   static checkEmailMatches(group: AbstractControl): {[key: string]: any} | null{
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');
  if(emailControl.value === confirmEmailControl.value || (confirmEmailControl.pristine
    && confirmEmailControl.value === '')){
    return null;
  } else{
    return {'EmailMissMatch': true};
  }
  
  };
}
