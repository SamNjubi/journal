import {ComponentRef} from '@angular/core';
import {BasePortalHost, ComponentPortal} from '../portal/portal';

/**
 * Reference to an overlay that has been created with the Overlay service.
 * Used to manipulate or dispose of said overlay.
 */
export class OverlayRef {
    // tslint:disable-next-line:variable-name
    constructor(private _portalHost: BasePortalHost) {
    }

    attach(portal: ComponentPortal<any>, newestOnTop: boolean): ComponentRef<any> {
        return this._portalHost.attach(portal, newestOnTop);
    }

    /**
     * Detaches an overlay from a portal.
     * @returns Resolves when the overlay has been detached.
     */
    detach(): void {
        return this._portalHost.detach();
    }
}
