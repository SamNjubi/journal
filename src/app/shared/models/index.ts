export { IRouteItem, ISideRoute, ICardConfig, ITaskMenuItem, IDropDownMenu, INotification, IAlert, IBadge } from './ui';
export { User, LoginResponse, Role } from './accounts';

export interface PaginationItem {
    page: number | null;
    label: string;
    disabled: boolean;
}
