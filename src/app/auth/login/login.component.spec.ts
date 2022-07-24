import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TuiPrimitiveTextfieldModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxLabeledModule, TuiFieldErrorModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule, TuiIslandModule } from '@taiga-ui/kit';
import { User } from 'src/app/shared/models';
import { AuthService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { PasswordComponent } from '../password/password.component';
import { RegisterComponent } from '../register/register.component';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let router: Router;
    let authServiceStub: Partial<AuthService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(
                    [
                        { path: 'auth/register', component: RegisterComponent },
                        { path: 'auth/password', component: PasswordComponent }
                    ]),
                HttpClientTestingModule, FormsModule, ReactiveFormsModule,
                TuiInputModule, TuiIslandModule, TuiTextfieldControllerModule, TuiInputPasswordModule, TuiCheckboxLabeledModule, TuiFieldErrorPipeModule],
            declarations: [LoginComponent],
            providers: [FormBuilder, { provide: AuthService, useValue: authServiceStub }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        router = TestBed.get(Router);

        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.ngOnInit();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should check if form is invalid when empty', () => {
        expect(component.loginForm.valid).toBeFalsy();
    });
    it('should check for the username field validity', () => {
        let errors = {};
        let username = component.loginForm.controls['username'];
        expect(username.valid).toBeFalsy();
        // username field is required
        errors = username.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set username to something
        username.setValue("test");
        errors = username.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['email']).toBeTruthy();

        // Set username to something correct
        username.setValue("test@example.com");
        errors = username.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['email']).toBeFalsy();
    });

    it('should check for the password field validity', () => {
        let errors = {};
        let password = component.loginForm.controls['password'];

        // Email field is required
        errors = password.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set email to something
        password.setValue("123456");
        errors = password.errors || {};
        expect(errors['required']).toBeFalsy();

        // Set email to something correct
        password.setValue("123456789");
        errors = password.errors || {};
        expect(errors['required']).toBeFalsy();
    });

    it('should check for the successful submission with valid inputs', () => {
        expect(component.loginForm.valid).toBeFalsy();
        component.loginForm.controls['username'].setValue("test@test.com");
        component.loginForm.controls['password'].setValue("123456789");
        expect(component.loginForm.valid).toBeTruthy();
    });
    it('should navigate to forgot pwd page when clicked', fakeAsync(() => {
        fixture.debugElement.query(By.css('a')).nativeElement.click();
        tick();
        expect(router.url).toBe('/auth/password');
    }));
    it('should navigate to register page when clicked', fakeAsync(() => {
        fixture.debugElement.query(By.css('a')).nativeElement.click();
        tick();
        expect(router.url).toBe('/auth/password');
    }));
});