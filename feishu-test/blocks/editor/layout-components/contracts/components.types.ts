export interface TopBarProps {
  title: string;
  onShare?: () => void;
  onToggleEdit?: () => void;
  isEditMode?: boolean;
}

export interface SidebarProps {
  items: SidebarItemData[];
  selectedId?: string;
  onItemClick?: (id: string) => void;
}

export interface SidebarItemData {
  id: string;
  title: string;
  icon?: string;
  children?: SidebarItemData[];
}

export interface EditorLayoutProps {
  title: string;
  content?: string;
  sidebarItems?: SidebarItemData[];
  showComments?: boolean;
  onContentChange?: (content: string) => void;
}