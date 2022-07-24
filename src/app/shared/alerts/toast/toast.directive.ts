import {Directive, ElementRef, ModuleWithProviders, NgModule} from '@angular/core';

@Directive({
    selector: '[appToastContainer]',
    exportAs: 'app-toast-container',
})
export class ToastContainerDirective {
    constructor(private el: ElementRef) {
    }

    getContainerElement(): HTMLElement {
        return this.el.nativeElement;
    }
}

@NgModule({
    exports: [ToastContainerDirective],
    declarations: [ToastContainerDirective],
})
export class ToastContainerModule {
    static forRoot(): ModuleWithProviders<ToastContainerModule> {
        return {
            ngModule: ToastContainerModule,
            providers: [],
        };
    }
}
