"use client";

import React from 'react';

interface DragHandleProps {
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  dragHandleRef?: (node: HTMLElement | null) => void;
  dragHandleProps?: any;
  className?: string;
}

export const DragHandle: React.FC<DragHandleProps> = ({
  onDragStart,
  onDragEnd,
  dragHandleRef,
  dragHandleProps,
  className
}) => {
  return (
    <div
      ref={dragHandleRef}
      className={`inline-flex items-center justify-center w-6 h-6 rounded cursor-grab hover:bg-muted transition-colors ${className || ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      {...dragHandleProps}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-muted-foreground"
      >
        {/* 九个点，3x3 网格 */}
        <circle cx="2" cy="2" r="0.8" fill="currentColor" />
        <circle cx="6" cy="2" r="0.8" fill="currentColor" />
        <circle cx="10" cy="2" r="0.8" fill="currentColor" />

        <circle cx="2" cy="6" r="0.8" fill="currentColor" />
        <circle cx="6" cy="6" r="0.8" fill="currentColor" />
        <circle cx="10" cy="6" r="0.8" fill="currentColor" />

        <circle cx="2" cy="10" r="0.8" fill="currentColor" />
        <circle cx="6" cy="10" r="0.8" fill="currentColor" />
        <circle cx="10" cy="10" r="0.8" fill="currentColor" />
      </svg>
    </div>
  );
};
