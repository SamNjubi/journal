import { GoogleLoginProvider, GoogleSigninButtonDirective, SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    loading = false;
    returnUrl: string;
    $loginResp: Observable<any>;
    username = new FormControl(null, [Validators.required, Validators.email]);
    password = new FormControl(null, [Validators.required]);

    constructor(
        private fb: FormBuilder,
        private activeRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient,
        private socialauthService: SocialAuthService,
        private auth: AuthService) {
        this.loginForm = this.fb.group({
            username: this.username,
            password: this.password,
            rememberme: new FormControl(false)
        });
        this.returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || '/';
    }

    ngOnInit(): void {
        this.socialauthService.authState.subscribe(
            (resp: any) => {
                this.auth.saveUserSession(resp.idToken, resp, true);
                // this.http.get<any>(`${environment.API_HOST}/user?token=${resp.idToken}`, ).subscribe(
                //     resp => {
                //         this.auth.saveUserSession(resp.JWTToken, resp, true);

                //     }
                // )
            }
        )
    }
}
