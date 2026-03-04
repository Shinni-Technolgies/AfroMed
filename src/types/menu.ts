import { ComponentType } from 'react';

export interface MenuItem {
  id: string;
  title: string;
  type: 'item' | 'group' | 'collapse';
  url?: string;
  icon?: ComponentType;
  breadcrumbs?: boolean;
  target?: boolean;
  external?: boolean;
  children?: MenuItem[];
}

export interface MenuGroup {
  id: string;
  title: string;
  type: 'group';
  children: MenuItem[];
}

export interface MenuItems {
  items: MenuGroup[];
}
