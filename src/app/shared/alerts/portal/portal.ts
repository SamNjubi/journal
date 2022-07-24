import {ComponentRef, Injector, ViewContainerRef} from '@angular/core';
// tslint:disable:variable-name
export type ComponentType<T> = new(...args: any[]) => T;

/**
 * A `ComponentPortal` is a portal that instantiates some Component upon attachment.
 */
export class ComponentPortal<T> {
    /**
     * [Optional] Where the attached component should live in Angular's *logical* component tree.
     * This is different from where the component *renders*, which is determined by the PortalHost.
     * The origin necessary when the host is outside of the Angular application context.
     */
    viewContainerRef: ViewContainerRef;

    private _attachedHost: BasePortalHost | any;

    constructor(public component: ComponentType<T>, public injector: Injector) {
    }

    /** Whether this portal is attached to a host. */
    get isAttached(): boolean {
        return this._attachedHost != null;
    }

    /** Attach this portal to a host. */
    attach(host: BasePortalHost, newestOnTop: boolean): any {
        this._attachedHost = host;
        return host.attach(this, newestOnTop);
    }

    /** Detach this portal from its host */
    detach(): void {
        const host = this._attachedHost;
        this._attachedHost = null;
        return host.detach();
    }

    /**
     * Sets the PortalHost reference without performing `attach()`. This is used directly by
     * the PortalHost when it is performing an `attach()` or `detach()`.
     */
    setAttachedHost(host: BasePortalHost): any {
        this._attachedHost = host;
    }
}

/**
 * Partial implementation of PortalHost that only deals with attaching a
 * ComponentPortal
 */
export abstract class BasePortalHost {
    public setToNullValue: any = null;
    /** The portal currently attached to the host. */
    private _attachedPortal: ComponentPortal<any> | any;

    /** A function that will permanently dispose this host. */
    private _disposeFn: () => void | any;

    attach(portal: ComponentPortal<any>, newestOnTop: boolean): any {
        this._attachedPortal = portal;
        return this.attachComponentPortal(portal, newestOnTop);
    }

    abstract attachComponentPortal<T>(
        portal: ComponentPortal<T>,
        newestOnTop: boolean,
    ): ComponentRef<T>;

    detach(): void {
        if (this._attachedPortal) {
            this._attachedPortal.setAttachedHost(null);
        }

        this._attachedPortal = null;
        if (this._disposeFn != null) {
            this._disposeFn();
            this._disposeFn = this.setToNullValue;
        }
    }

    setDisposeFn(fn: () => void): void {
        this._disposeFn = fn;
    }
}
