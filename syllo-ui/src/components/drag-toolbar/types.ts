import { ReactNode } from 'react';

export interface MenuItem {
  id: string;
  name: string;
  label: string;
  icon: ReactNode;
  type: 'item' | 'submenu';
  data?: Record<string, any>;
  submenu?: SubMenuItem[];
}

export interface SubMenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  data?: Record<string, any>;
  action?: () => void;
}

export interface MenuSection {
  id: string;
  title: string;
  type: 'section' | 'flatten-grid';
  items: MenuItem[];
}

export interface FlattenGridItem {
  id: string;
  name: string;
  tooltip: string;
  icon: ReactNode;
  action?: () => void;
}

export interface TableGridSelection {
  rows: number;
  cols: number;
}

export interface ColumnLayout {
  id: string;
  label: string;
  columns: number;
  icon: ReactNode;
  layout?: 'equal' | 'left-right' | 'right-left';
}

export interface EmbedService {
  id: string;
  label: string;
  icon: ReactNode;
  url?: string;
}

export type MenuAction = (item: MenuItem | SubMenuItem) => void;