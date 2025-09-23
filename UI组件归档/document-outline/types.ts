export interface TocItem {
  id: string;
  title: string;
  level: number;
  children?: TocItem[];
}

export interface DocumentOutlineProps {
  className?: string;
  tocData?: TocItem[];
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}