'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { TextIcon, DragHandleIcon } from './icons';

interface DragHandleProps {
  className?: string;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  onClick?: () => void;
  dragHandleRef?: (node: HTMLElement | null) => void;
  dragHandleProps?: any;
}

const DragHandle: React.FC<DragHandleProps> = ({
  className = '',
  onDragStart,
  onDragEnd,
  onClick,
  dragHandleRef,
  dragHandleProps
}) => {
  return (
    <Button
      ref={dragHandleRef}
      variant="outline"
      size="sm"
      className={`h-[26px] w-[42px] p-0 border border-gray-200 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-900 hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-grab active:cursor-grabbing ${className}`}
      {...(dragHandleProps || {})}
      draggable={!dragHandleProps}
      onDragStart={!dragHandleProps ? onDragStart : undefined}
      onDragEnd={!dragHandleProps ? onDragEnd : undefined}
      onClick={onClick}
    >
      <div className="flex items-center justify-center gap-0">
        <div className="w-6 h-6 flex items-center justify-center">
          <TextIcon />
        </div>
        <div className="w-[14px] h-[14px] text-gray-500">
          <DragHandleIcon />
        </div>
      </div>
    </Button>
  );
};

export default DragHandle;