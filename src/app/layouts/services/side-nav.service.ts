import {Injectable} from '@angular/core';
import {ICardConfig, IRouteItem, ISideRoute} from '../../shared/models';

export interface IRouteConfig {
    baseRoute: string;
    routes: ISideRoute[] | IRouteItem[];
}


@Injectable({
    providedIn: 'root'
})
export class SideNavService {
    cardConfig: ICardConfig;
    sideRoutes: ISideRoute[] = [];
    routeConfig: IRouteConfig;
    hideSideNav = false;

    constructor() {
    }

    toggleSideNav(): void {
        this.hideSideNav = !this.hideSideNav;
    }
}
