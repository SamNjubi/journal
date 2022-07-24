import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Observable } from 'rxjs';
import { BaseAPIService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { environment as vars } from '../../../environments/environment';

@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

    emailForm: FormGroup;
    loading = false;
    $requestreset: Observable<any>;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private api: BaseAPIService,
        @Inject(TuiAlertService)
        private readonly alertService: TuiAlertService,) {
        this.emailForm = this.fb.group({
            email: new FormControl(null, [Validators.required, Validators.email]),
        });
    }

    ngOnInit(): void {
    }
    sendReset(): void {
        this.loading = true;
        this.$requestreset = this.api.get(`${environment.AUTH_HOST}`, `${vars.AUTH_BACKEND.JWT.AUTH_FORGOTPWD_ENDPOINT}${this.emailForm.value.email}`)
        this.loading = false;
    }
}
