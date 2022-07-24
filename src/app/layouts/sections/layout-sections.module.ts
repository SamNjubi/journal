import {Component, NgModule, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {PageContentComponent} from './content/page-content.component';
import {NavbarComponent} from './navbar/navbar.component';
import {FooterComponent} from './footer/footer.component';

@Component({
    selector: 'app-page-layout',
    template: `
        <div class="wrapper">
            <app-navbar [containerClass]="'container'"></app-navbar>
            <app-page-content></app-page-content>
            <app-footer></app-footer>
        </div>
    `,
    styles: [
        `
            .wrapper {
                display: flex;
                flex-direction: column;
                min-height: 100%;
                justify-content: space-between;
            }
        `
    ]
})
export class PageLayoutComponent implements OnInit {
    constructor() {
    }

    ngOnInit(): void {
    }
}


@NgModule({
    declarations: [
        PageLayoutComponent,
        PageContentComponent,
        FooterComponent,
        NavbarComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ],
    exports: [
        PageLayoutComponent,
        PageContentComponent,
        FooterComponent,
        NavbarComponent
    ]
})
export class LayoutSectionsModule {
}
