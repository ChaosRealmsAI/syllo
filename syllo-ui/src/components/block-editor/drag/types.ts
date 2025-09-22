export type BlockType =
  | "heading1"
  | "heading2"
  | "heading3"
  | "paragraph"
  | "orderedList"
  | "unorderedList"
  | "code"
  | "quote"
  | "divider"
  | "columns"
  // Markdown 扩展
  | "table"
  | "checkboxList"
  // 文档引用
  | "linkPreview"
  | "documentEmbed"
  // 任务管理
  | "taskCard"
  | "taskList"
  | "kanbanBoard"
  // 高亮块
  | "highlightBlock";

export interface Block {
  id: string;
  type: BlockType;
  content: any;
  children?: Block[];
  layout?: "vertical" | "horizontal";
  width?: number; // 横向排列时的宽度百分比
  parentId?: string | null;
}

export interface DragState {
  activeId: string | null;
  overId: string | null;
  dropPosition: "before" | "after" | "inside" | "left" | "right";
}

export interface DropIndicatorPosition {
  targetId: string;
  position: "top" | "bottom" | "left" | "right";
  indent?: number;
}

export interface DragData {
  block: Block;
  index: number;
  parentId?: string | null;
}