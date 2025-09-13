'use client';

import React from 'react';
import { DragHandleProps } from '../contracts/drag.types';

export function DragHandle({ blockId, onDragStart, onDragEnd, onHandleHover }: DragHandleProps) {
  return (
    <div
      className="drag-handle-wrapper"
      style={{
        position: 'absolute',
        left: '-46px',
        top: '0',
        bottom: '0',
        width: '42px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
      }}
      onMouseEnter={() => onHandleHover?.(true)}
      onMouseLeave={() => onHandleHover?.(false)}
    >
      <div
        className="drag-handle hover:bg-gray-100 transition-all"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('blockId', blockId);
          onDragStart?.();
        }}
        onDragEnd={onDragEnd}
        style={{
          width: '24px',
          height: '24px',
          cursor: 'grab',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px',
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.cursor = 'grabbing';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.cursor = 'grab';
        }}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none"
        >
          <circle cx="6" cy="6" r="1.5" fill="#8f959e"/>
          <circle cx="14" cy="6" r="1.5" fill="#8f959e"/>
          <circle cx="6" cy="10" r="1.5" fill="#8f959e"/>
          <circle cx="14" cy="10" r="1.5" fill="#8f959e"/>
          <circle cx="6" cy="14" r="1.5" fill="#8f959e"/>
          <circle cx="14" cy="14" r="1.5" fill="#8f959e"/>
        </svg>
      </div>
    </div>
  );
}