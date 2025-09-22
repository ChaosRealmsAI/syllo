"use client";

import React from 'react';

interface FramedDragHandleProps {
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  dragHandleRef?: (node: HTMLElement | null) => void;
  dragHandleProps?: any;
  className?: string;
  showBorder?: boolean;
  darkMode?: boolean;
}

export const FramedDragHandle: React.FC<FramedDragHandleProps> = ({
  onDragStart,
  onDragEnd,
  dragHandleRef,
  dragHandleProps,
  className,
  showBorder = true,
  darkMode = true
}) => {
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-300';
  const bgColor = darkMode ? 'bg-gray-800/50' : 'bg-white';
  const hoverBgColor = darkMode ? 'hover:bg-gray-700/70' : 'hover:bg-gray-100';
  const iconColor = darkMode ? 'text-gray-400' : 'text-gray-600';
  const hoverIconColor = darkMode ? 'hover:text-gray-200' : 'hover:text-gray-900';

  return (
    <div
      ref={dragHandleRef}
      className={`
        inline-flex items-center justify-center
        w-10 h-7
        rounded-md
        ${showBorder ? `border ${borderColor}` : ''}
        ${bgColor}
        ${hoverBgColor}
        cursor-grab
        active:cursor-grabbing
        transition-all duration-150
        hover:shadow-sm
        ${className || ''}
      `}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      {...dragHandleProps}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconColor} ${hoverIconColor} transition-colors`}
      >
        {/* 九个点，3x3 网格，更分散的布局 */}
        <circle cx="2" cy="2" r="1" fill="currentColor" />
        <circle cx="7" cy="2" r="1" fill="currentColor" />
        <circle cx="12" cy="2" r="1" fill="currentColor" />

        <circle cx="2" cy="7" r="1" fill="currentColor" />
        <circle cx="7" cy="7" r="1" fill="currentColor" />
        <circle cx="12" cy="7" r="1" fill="currentColor" />

        <circle cx="2" cy="12" r="1" fill="currentColor" />
        <circle cx="7" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    </div>
  );
};