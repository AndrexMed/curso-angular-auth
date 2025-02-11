import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { RequestStatus } from '@models/request.status.model';
import { AuthService } from '@services/auth.service';

import { CustomValidators } from '@utils/validators';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {

  formEmailValidator = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
  })

  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [CustomValidators.MatchValidator('password', 'confirmPassword')]
  });

  status: RequestStatus = 'init';
  statusUserEmail: RequestStatus = 'init'

  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;

  errorMessage: string = ""
  showRegister: boolean = false

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authSvc: AuthService
  ) { }

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password } = this.form.getRawValue();
      console.log(name, email, password);

      this.authSvc
        .registerAndLogin(name, email, password)
        .subscribe({
          next: () => {
            this.status = 'success';
            this.router.navigate(["/app/boards"])
          },
          error: (error) => {
            this.status = 'failed';
            this.errorMessage = error
          }
        })
    } else {
      this.form.markAllAsTouched();
    }
  }

  validateUserEmail() {

    if (this.formEmailValidator.valid) {

      this.statusUserEmail = 'loading'

      const { email } = this.formEmailValidator.getRawValue()

      this.authSvc.isAvailable(email)
        .subscribe({
          next: (rta) => {
            this.statusUserEmail = 'success'

            this.showRegister = true

            if (rta.isAvailable) {
              this.form.controls.email.setValue(email)
            } else {
              this.router.navigate(['/login'], { queryParams: { email } })
            }
          },
          error: (error) => {
            console.log(error)
          }
        })


    } else {
      console.log("Es invalido")
      this.formEmailValidator.markAllAsTouched()
    }
  }
}
