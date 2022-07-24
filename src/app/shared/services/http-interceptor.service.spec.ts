import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { EnvironmentService } from './environment.service';

import { HttpInterceptorService } from './http-interceptor.service';

describe('HttpInterceptorService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        providers: [Router, HttpClient, EnvironmentService, AuthService]
    }));

    it('should be created', () => {
        const service: HttpInterceptorService = TestBed.get(HttpInterceptorService);
        expect(service).toBeTruthy();
    });
});
