import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAlertContext } from '@taiga-ui/cdk';
import { TuiAlertOptions, TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Observable, tap } from 'rxjs';
import { BaseAPIService } from 'src/app/shared/services';
import { CustomValidator } from 'src/app/shared/Validators/CustomValidator';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-confirm-password',
    templateUrl: './confirm-password.component.html',
    styleUrls: ['./confirm-password.component.scss']
})
export class ConfirmPasswordComponent implements OnInit {


    @ViewChild('passwordconfirmTemplate')
    passwordconfirmTemplate?: TemplateRef<TuiAlertContext<TuiAlertOptions<unknown>>>;
    passwordConfirmForm: FormGroup;
    loading = false;
    url = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwMDA2OSwibmFtZSI6ImFtYW5pIHRpd2kiLCJmaXJzdE5hbWUiOiJhbWFuaSIsImxhc3ROYW1lIjoidGl3aSIsInVzZXJuYW1lIjoidGl3aXdpNjAwM0BhcmVnb2RzLmNvbSIsInJvbGVJZCI6LTEsInJvbGVOYW1lIjoiIiwiY3VzdG9tZXJJZCI6LTEsImN1c3RvbWVyTmFtZSI6IiIsImlhdCI6MTY1ODQ3NjA5MSwiZXhwIjoxNjU4NTE5MjkxfQ.PRLz8hVc5b4TFAiTyFreur4b4bvIbDbjbSjOG4TFuXQ/tiwiwi6003@aregods.com';
    $resetpwdResp: Observable<any>;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private api: BaseAPIService,
        private route: ActivatedRoute,
        @Inject(TuiAlertService)
        private readonly alertService: TuiAlertService,) {

        this.passwordConfirmForm = this.fb.group({
            email: new FormControl(this.route.snapshot.paramMap.get('email'), [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
            confirmPassword: new FormControl(null, [Validators.required]),
            token: new FormControl(this.route.snapshot.paramMap.get('token'), [Validators.required])
        }, { validators: CustomValidator.matchPassword }
        );
    }

    ngOnInit(): void {
    }
    setPassword(): void {
        this.loading = true;
        const body = {
            password: this.passwordConfirmForm.controls['password'].value,
            confirmPassword: this.passwordConfirmForm.controls['confirmPassword'].value
        }
        this.$resetpwdResp = this.api.post(`${environment.AUTH_HOST}`, `${environment.AUTH_BACKEND.JWT.AUTH_VERIFICATION_ENDPOINT}${this.passwordConfirmForm.controls['token'].value}`, body);
        this.loading = false;
        this.$resetpwdResp.pipe(
            tap(
                val => {
                    this.showNotification();
                }
            )
        )
    }
    showNotification(): void {
        this.alertService
            .open(this.passwordconfirmTemplate || '', {
                label: 'Success.',
                status: TuiNotification.Success,
                autoClose: false,
            })
            .subscribe();
    }
}