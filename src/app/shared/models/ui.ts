export interface IBadge {
  count: number;
  color: string;
}

export interface IRouteItem {
  name: string;
  roles?: {};
  path: string;
  icon?: string;
  badge?: IBadge;
  click?: any;
  subject: any;
}

export interface ISideRoute {
  name: string;
  path: string;
  icon: string;
  menuItems?: IRouteItem[];
  badge?: IBadge;
}

export interface ICardConfig {
  title?: string;
  description?: string;
  image?: string;
  imgCircle?: boolean;
}

export interface ITaskMenuItem {
  title: string;
  progress: number;
}

export interface IDropDownMenu {
  name: string;
  path: string;
  menuItems: IRouteItem[];
  icon: string;
}

export interface INotification {
  sender: string;
  content: string;
  time: string;
}

export interface IAlert {
  content: string;
  time: string;
}
