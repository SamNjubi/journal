import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    // auth: any;

    constructor(private router: Router, private auth: AuthService) {
        this.auth = auth;
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const isLoggedIn = this.auth.isLoggedIn();


        if (isLoggedIn || !environment.ENABLE_AUTH) {
            return true;
        }

        this.router.navigate(['/auth/login'],
            { queryParams: { returnUrl: state.url } });
        return false;
    }
}
