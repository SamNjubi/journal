import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TuiDataListModule, TuiHintModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule, TuiIslandModule, TuiFieldErrorPipeModule, TuiSelectModule, TuiDataListWrapperModule } from '@taiga-ui/kit';
import { AuthService } from 'src/app/shared/services';
import { LoginComponent } from '../login/login.component';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;

    let router: Router;
    let authServiceStub: Partial<AuthService>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule.withRoutes(
                    [
                        { path: 'auth/login', component: LoginComponent },
                    ]),
                HttpClientTestingModule, FormsModule, ReactiveFormsModule,
                TuiHintModule, TuiInputModule, TuiIslandModule, TuiSelectModule, TuiDataListModule, TuiDataListWrapperModule, TuiLoaderModule, TuiTextfieldControllerModule, TuiFieldErrorPipeModule],
            declarations: [RegisterComponent],
            providers: [FormBuilder, { provide: AuthService, useValue: authServiceStub }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        router = TestBed.get(Router);

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should check if form is invalid when empty', () => {
        expect(component.registerForm.valid).toBeFalsy();
    });
    it('should check for the firstName field validity', () => {
        let errors = {};
        let firstName = component.registerForm.controls['firstName'];
        expect(firstName.valid).toBeFalsy();
        // firstName field is required
        errors = firstName.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set firstName to something
        firstName.setValue("test");
        errors = firstName.errors || {};
        expect(errors['required']).toBeFalsy();

        // Set firstName to something correct
        firstName.setValue("test");
        errors = firstName.errors || {};
        expect(errors['required']).toBeFalsy();
    });
    it('should check for the lastName field validity', () => {
        let errors = {};
        let lastName = component.registerForm.controls['lastName'];
        expect(lastName.valid).toBeFalsy();
        // lastName field is required
        errors = lastName.errors || {};
        expect(errors['required']).toBeTruthy();

        // Set lastName to something
        lastName.setValue("test");
        errors = lastName.errors || {};
        expect(errors['required']).toBeFalsy();

        // Set firstName to something correct
        lastName.setValue("test2");
        errors = lastName.errors || {};
        expect(errors['required']).toBeFalsy();
    });
    it('should check for the username field validity', () => {
        let errors = {};
        let username = component.registerForm.controls['username'];
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

    it('should check for successful submission with valid inputs', () => {
        expect(component.registerForm.valid).toBeFalsy();
        component.registerForm.controls['firstName'].setValue("test");
        component.registerForm.controls['lastName'].setValue("test2");
        component.registerForm.controls['username'].setValue("test@test2.com");
        component.registerForm.controls['roleId'].setValue("1");
        component.registerForm.controls['customerDomain'].setValue("dev");
        expect(component.registerForm.valid).toBeTruthy();
    });
    it('should navigate to login page when clicked', fakeAsync(() => {
        fixture.debugElement.query(By.css('a')).nativeElement.click();
        tick();
        expect(router.url).toBe('/auth/login');
    }));
});
