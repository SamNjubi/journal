import { FormGroup } from '@angular/forms';

export class CustomValidator {
   // Validates passwords
   static matchPassword(group: FormGroup): any {
      const new_password1 = group.controls['password'];
      const new_password2 = group.controls['confirm_password'];
      if (new_password1.pristine || new_password2.pristine) {
         return null;
      }
      group.markAsTouched();
      if (new_password1.value === new_password2.value) {
         return null;
      }
      return {
         doNotMatch: true
      };
   }
}
