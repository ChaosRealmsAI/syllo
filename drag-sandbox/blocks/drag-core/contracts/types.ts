/**
 * 拖拽系统契约定义
 */

export interface DraggableBlock {
  id: string;
  content: React.ReactNode | string;
  type?: 'heading' | 'paragraph' | 'list' | 'quote' | 'custom';
  metadata?: Record<string, any>;
}

export interface DragSystemOptions {
  container?: string | HTMLElement;
  onReorder?: (detail: ReorderDetail) => void;
  enableHoverZone?: boolean;
  enableHandleHighlight?: boolean;
  handlePosition?: 'left' | 'right';
  handleOffset?: number;
}

export interface ReorderDetail {
  from: string;
  to: string;
  position: 'before' | 'after';
  newOrder?: string[];
}

export interface DragState {
  isDragging: boolean;
  draggedId: string | null;
  dropTargetId: string | null;
  dropPosition: 'before' | 'after' | null;
}