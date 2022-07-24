// tslint:disable:variable-name

import { BaseModel } from './base';

export class User extends BaseModel {
    firstName?: string;
    lastName?: string;
    roleName?: string;
    customerName?: string;
    nationalId?: any;
    userProfileLink?: string;
    workPhone?: string;
    email?: string;
    username?: string;
    jiraserviceaccountid?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    stateId?: string;
    roleId?: number;
    postalCode?: string;
    isActive?: boolean;
    name?: string;
}

export enum Roles {
  Portal_Admin = 'Portal Admin',
  Portal_User = 'Portal User',
  Company_Admin = 'Company Admin',
  Company_User = 'Company User',
}

export enum ContactMethod {
  Email = 'Email',
  Phone = 'Phone',
  Other = 'Other',
}

export class Role extends BaseModel {
  name: string;
}

export interface LoginResponse {
  token?: string;
  user?: User;
}

export interface Token extends User {
  customerId: number;
  customerName: string;
  firstName: string;
  lastName: string;
  name: string;
  roleId: number;
  roleName: string;
  userTypeid: number;
  username: string;
  timeZone: string;
  sub: number;
}
