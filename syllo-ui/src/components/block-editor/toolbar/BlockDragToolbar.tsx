"use client";

import React from 'react';
import { DragHandle } from '../../drag-toolbar';
import { SlashMenuPopover } from '../../menu/src';

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
      <DragHandle
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        dragHandleRef={dragHandleRef}
        dragHandleProps={dragHandleProps}
      />
    </SlashMenuPopover>
  );
};