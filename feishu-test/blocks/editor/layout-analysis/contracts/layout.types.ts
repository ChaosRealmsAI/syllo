export interface EditorLayout {
  topBar: TopBarConfig;
  sidebar: SidebarConfig;
  mainEditor: MainEditorConfig;
  commentPanel: CommentPanelConfig;
}

export interface TopBarConfig {
  left: {
    backButton: boolean;
    homeButton: boolean;
    title: string;
  };
  center: {
    breadcrumb: string[];
  };
  right: {
    shareButton: boolean;
    editModeToggle: boolean;
    moreOptions: boolean;
    userAvatar: boolean;
  };
}

export interface SidebarConfig {
  visible: boolean;
  width: number;
  items: SidebarItem[];
}

export interface SidebarItem {
  id: string;
  title: string;
  icon?: string;
  children?: SidebarItem[];
  level: number;
}

export interface MainEditorConfig {
  title: {
    text: string;
    level: 'h1' | 'h2' | 'h3';
  };
  metadata: {
    author: string;
    lastModified: string;
  };
  contentArea: {
    width: string;
    padding: string;
  };
}

export interface CommentPanelConfig {
  visible: boolean;
  width: number;
  position: 'right' | 'bottom';
}