import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment as vars } from '../../../environments/environment';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';


@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
    exemptedUris: string[] = [];
    error401 = `
    <p>You have no permission to access a resource. Your session might have expired. Ask for authorization and try again.</p>
    `;

    constructor(private router: Router,
        private http: HttpClient,
        private auth: AuthService,
        private alertService: TuiAlertService) {
        // const loginUrl = vars.AUTH_BACKEND.TOKEN.default ? vars.AUTH_BACKEND.TOKEN.AUTH_ENDPOINT :
        //     vars.AUTH_BACKEND.JWT.AUTH_LOGIN_ENDPOINT;
        // const loginEndpoint = `${environment.API_HOST}${loginUrl}`;
        // this.exemptedUris = [
        //     loginEndpoint
        // ];
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.exemptedUris.includes(req.url) && vars.ENABLE_AUTH === true) {
            const newRequest = req.clone({
                headers: req.headers.set('Authorization', this.auth.token || '')
            });
            return next.handle(newRequest).pipe(tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // handle other responses here
                }
            }, (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 400) {
                        if (err.error.non_field_errors) {
                            this.alertService.open(err.error.non_field_errors.join(), { label: `Input Error!! ${err.status}`, status: TuiNotification.Warning, autoClose: false }).subscribe();
                        } else if (err.error.field_errors) {
                            const fieldErrors: any[] = [];
                            for (const [key, value] of Object.entries(err.error.field_errors)) {
                                fieldErrors.push([`${key}: ${value}`]);
                            }
                            this.alertService.open(fieldErrors.join(' '), { label: `Input Error!! ${err.status}`, status: TuiNotification.Warning, autoClose: false }).subscribe();
                        } else if (err.error.error) {
                            this.alertService.open(err.error.error, { label: `Input Error!! ${err.status}`, status: TuiNotification.Warning, autoClose: false }).subscribe();
                        } else if (err.error.message) {
                            this.alertService.open(err.error.message, { label: `Input Error!! ${err.status}`, status: TuiNotification.Warning, autoClose: false }).subscribe();
                        } else {
                            this.alertService.open(JSON.stringify(err.error), { label: `Input Error!! ${err.status}`, status: TuiNotification.Warning, autoClose: false }).subscribe();
                        }
                    } else if (err.status === 401) {
                        this.auth.logout();
                        this.alertService.open(`${this.error401}`, { label: `Authorization Error! ${err.status}`, status: TuiNotification.Warning, autoClose: false }).subscribe();
                    } else if (err.status === 403) {
                        this.alertService.open(`Sorry, you are required to login to perform this action. ${err.statusText}`, { label: `Authorization Error! ${err.status}`, status: TuiNotification.Warning, autoClose: false }).subscribe();
                    } else if (err.status === 404) {
                        this.alertService.open(`${err.statusText}`, { label: `Authorization Error! ${err.status}`, status: TuiNotification.Warning, autoClose: false }).subscribe();
                    } else if (err.status === 405) {
                        this.alertService.open(`${err.statusText}`, { label: 'Method not allowed!', status: TuiNotification.Warning, autoClose: false }).subscribe();
                    } else if (err.status === 500) {
                        this.alertService.open('Internal server error. Please try again later.', { label: `System Maintenance!`, status: TuiNotification.Warning, autoClose: false }).subscribe();
                    } else {

                        this.alertService.open('Something went wrong. Please ensure your internet is good and try again.', { label: `System Maintenance!`, status: TuiNotification.Warning, autoClose: false }).subscribe();
                    }
                }
            }));
        }
        return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                // handle other responses here
            }
        }, (err: any) => {
            if (err instanceof HttpErrorResponse) {
                if (err.status === 401 || err.status === 403) {
                    this.auth.logout();
                    this.router.navigateByUrl('/auth/login').then(nav => {
                    }, error => error);
                }
            }
        }));
    }
}
