import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginResponse, User } from '../models/';
import { environment as vars } from '../../../environments/environment';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Role, Token } from '../models/accounts';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  attemptingLogin: boolean;
  loginError: string;
  user: User;
  token: string;
  timer: any;
  session;
  returnUrl: any;
  $roles = new BehaviorSubject<Role[]>([]).asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {
    this.session = localStorage.getItem(environment.TITLE + '_authenticated');
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    if (this.session != null) {
      this.user = JSON.parse(this.session).user;
      this.token = JSON.parse(this.session).key;
    }

    // setTimeout( () => {
    //         this.timer = setInterval(() => {
    //             const now = new Date();
    //             const expiry = JSON.parse(localStorage.getItem(environment.TITLE + '_authenticated')).expiry_time;
    //             if (now.valueOf() - (29 * 60 * 1000) <= parseInt(expiry, 10)) {
    //                 const t = JSON.parse(localStorage.getItem(environment.TITLE + '_authenticated')).token;
    //                 this.http.post<LoginResponse>(`${vars.AUTH_BACKEND.JWT.TOKEN_REFRESH_ENDPOINT}`, {token: t}).subscribe(
    //                     resp => {
    //                         this.saveUserSession(resp.token, resp.user, true);
    //                     }
    //                 )
    //             }
    //         }, 25 * 60 * 1000);
    //     }
    //     ,24 * 60 * 60 * 1000
    // );
  }

  ngOnDestroy(): void {
    if (this.timer) {
      this.timer = null;
    }
  }

  login(
    authParam: string,
    loginPassword: string,
    rememberMe: boolean = false
  ): any {
    this.attemptingLogin = true;
    if (vars.ENABLE_AUTH) {
      const body = { password: loginPassword, remember_me: rememberMe };
      body[`${vars.AUTH_BACKEND.AUTH_PARAM}`] = authParam;
      const loginUri = vars.AUTH_BACKEND.TOKEN.default
        ? vars.AUTH_BACKEND.TOKEN.AUTH_ENDPOINT
        : vars.AUTH_BACKEND.JWT.AUTH_LOGIN_ENDPOINT;
      this.http
        .post<LoginResponse>(`${environment.AUTH_HOST}${loginUri}`, body)
        .subscribe(
          (resp) => {
            const respHeaders: HttpHeaders = new HttpHeaders({
              Authorization: `${vars.AUTH_BACKEND.AUTH_HEADER_PREFIX} ${resp.token}`,
            });
            this.token = resp.token;
            // if (resp.user === undefined) {
            //   const decodedTokenUser: Token = jwtDecode(this.token);
            //   this.saveUserSession(this.token, decodedTokenUser, true);
            // } else {
            //   this.user = resp.user;
            //   this.saveUserSession(resp.token, resp.user, true);
            // }
          },
          (errResponse: HttpErrorResponse) => {
            if (errResponse.status === 400) {
              this.loginError = errResponse.error.non_field_errors;
              setTimeout(() => {
                this.loginError = '';
              }, 3000);
            } else {
              if (errResponse.error instanceof Error) {
                this.loginError =
                  'An error occurred:' + errResponse.error.message;
              }
              if (errResponse.status) {
                this.loginError =
                  'Error Code ' +
                  errResponse.status +
                  '. Something went wrong. Try again.';
              }
              this.loginError =
                'Something went wrong. Ensure your API authentication server is running and try again.';
            }
            this.alertService
              .open(`${errResponse.error.error}`, {
                label: 'Error!',
                autoClose: false,
                status: TuiNotification.Error,
              })
              .subscribe();
            this.attemptingLogin = false;
            return false;
          }
        );
    }
  }

  register(formbody: any): Observable<any> {

    return this.http.post(
      `${environment.API_HOST}${vars.AUTH_BACKEND.JWT.AUTH_REGISTER_ENDPOINT}`,
      formbody
    );
  }

  saveUserSession(
    token: string,
    sessionUser: User,
    remember: boolean,
    expiry: number = 30 * 60 * 1000
  ): void {
    if (remember) {
      const now = new Date();
      localStorage.setItem(
        environment.TITLE + '_authenticated',
        JSON.stringify({
          user: sessionUser,
          key: token,
          expiry_time: now.valueOf() + expiry,
        })
      );
    }
    this.user = sessionUser;
    this.token = token;
    this.router.navigateByUrl(`${this.returnUrl}`);
  }

  updateToken(sessionKey: string): void {
    if (this.session) {
      localStorage.removeItem(environment.TITLE + '_authenticated');
      localStorage.setItem(
        environment.TITLE + '_authenticated',
        JSON.stringify({ user: this.user, key: sessionKey })
      );
    } else {
      this.token = sessionKey;
    }
  }
  // decodedToken(): Token {
  //   const decodedToken: Token = jwtDecode(this.token);
  //   return decodedToken;
  // }

  logout(): void {
    localStorage.removeItem(environment.TITLE + '_authenticated');
    this.user = null;
    this.token = null;
    this.router.navigateByUrl('/auth/login');
  }

  isLoggedIn(): boolean {
    return (
      this.user !== null &&
      this.user !== undefined &&
      this.token !== null &&
      this.token !== undefined
    );
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService },
];
