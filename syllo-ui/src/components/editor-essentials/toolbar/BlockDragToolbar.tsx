"use client";

import React from 'react';
import { FramedDragHandle } from '@/components/drag-toolbar';
import { SlashMenuPopover } from '@/components/menu';

interface BlockDragToolbarProps {
  onMenuItemClick?: (item: any) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  dragHandleRef?: (node: HTMLElement | null) => void;
  dragHandleProps?: any;
}

export const BlockDragToolbar: React.FC<BlockDragToolbarProps> = ({
  onMenuItemClick,
  onDragStart,
  onDragEnd,
  dragHandleRef,
  dragHandleProps
}) => {
  return (
    <SlashMenuPopover onMenuItemClick={onMenuItemClick} trigger="hover">
      <FramedDragHandle
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        dragHandleRef={dragHandleRef}
        dragHandleProps={dragHandleProps}
        darkMode={true}
        showBorder={true}
      />
    </SlashMenuPopover>
  );
};