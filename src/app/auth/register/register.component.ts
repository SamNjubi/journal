import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TuiAlertContext, TuiContextWithImplicit, tuiPure, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiAlertOptions, TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { map, Observable, Subscription, tap } from 'rxjs';
import { Role } from 'src/app/shared/models';
import { BaseAPIService } from 'src/app/shared/services';
import { environment, environment as vars } from '../../../environments/environment';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

    @ViewChild('loginTemplate')
    loginTemplate?: TemplateRef<TuiAlertContext<TuiAlertOptions<unknown>>>;
    registerForm: FormGroup;
    loading = false;
    $signupresp: Observable<any>;

    registerResp: Observable<any>
    responsebody: Observable<Object>;
    disabledRole = true;
    customerDomain: string;

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private api: BaseAPIService,
        @Inject(TuiAlertService)
        private readonly alertService: TuiAlertService,) {
        this.registerForm = this.fb.group({
            firstName: new FormControl(null, [Validators.required]),
            lastName: new FormControl(null, [Validators.required]),
            username: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null, Validators.required),
            confirmpassword: new FormControl(null, Validators.required)
        });
    }

    ngOnInit(): void {
    }
    signup(): void {
        this.loading = true;
        //to do
        this.$signupresp = this.api.post(`${environment.API_HOST}`, `${vars.AUTH_BACKEND.JWT.AUTH_REGISTER_ENDPOINT}`, this.registerForm.value);
        this.loading = false;
    }
}
