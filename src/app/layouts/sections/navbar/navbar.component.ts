import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
    IRouteItem,
} from '../../../shared/models';
import { topMenus } from 'src/app/shared/models/menus';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    @Output() toggleSidebarEvent: EventEmitter<any> = new EventEmitter();
    @Input() showToggle = false;
    @Input() topRoutes: IRouteItem[] = topMenus;
    @Input() containerClass: 'container-fluid' | 'container' = 'container';
    currenturl = '';

    constructor(public auth: AuthService) {
    }

    ngOnInit(): void {
    }
}
