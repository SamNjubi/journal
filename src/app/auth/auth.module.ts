import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthRoutingModule } from './auth-routing.module';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';

import { TuiButtonModule, TuiDataListModule, TuiErrorModule, TuiHintModule, TuiLoaderModule, TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxLabeledModule, TuiDataListWrapperModule, TuiFieldErrorPipeModule, TuiInputModule, TuiInputPasswordModule, TuiIslandModule, TuiSelectModule } from '@taiga-ui/kit';
import { TuiLetModule } from '@taiga-ui/cdk';
import { GoogleLoginProvider, GoogleSigninButtonDirective, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';

@NgModule({
    declarations: [
        AuthComponent, LoginComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule,

        TuiIslandModule,
        TuiInputModule,
        TuiInputPasswordModule,
        TuiErrorModule,
        TuiFieldErrorPipeModule,
        TuiHintModule,
        TuiLetModule,
        TuiButtonModule,
        TuiCheckboxLabeledModule,
        TuiSelectModule,
        TuiDataListModule,
        TuiDataListWrapperModule,
        TuiLoaderModule,
        TuiSelectModule,
        TuiLetModule,
        TuiTextfieldControllerModule,
        TuiSvgModule,
        SocialLoginModule

    ],
    providers: [
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            '154812911866-5da8sg7cpjnbess3d5qglse0i44t5p9k.apps.googleusercontent.com'
                        )
                    }
                ],
                onError: (err) => {
                }
            } as SocialAuthServiceConfig,
        },
        GoogleSigninButtonDirective
    ]
})
export class AuthModule {
}
