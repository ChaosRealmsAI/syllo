export interface DraggableBlock {
  id: string;
  content: string;
  type: 'paragraph' | 'heading' | 'list' | 'quote';
  level?: number;
  columnId?: string;
}

export interface BlockColumn {
  id: string;
  blocks: DraggableBlock[];
  width: number; // percentage
}

export interface BlockRow {
  id: string;
  columns: BlockColumn[];
}

export interface DragState {
  isDragging: boolean;
  draggedBlockId: string | null;
  dragOverBlockId: string | null;
  dropPosition: 'before' | 'after' | 'inside' | 'column' | null;
}

export interface DragHandleProps {
  blockId: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onHandleHover?: (isHovering: boolean) => void;
}

export interface DroppableAreaProps {
  blocks: DraggableBlock[];
  onReorder: (blocks: DraggableBlock[]) => void;
  onCreateColumn: (blockId: string, targetBlockId: string) => void;
}