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
