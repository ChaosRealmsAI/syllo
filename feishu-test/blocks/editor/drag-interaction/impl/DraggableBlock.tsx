'use client';

import React, { useState } from 'react';
import { DraggableBlock as BlockType } from '../contracts/drag.types';
import { DragHandle } from './DragHandle';

interface DraggableBlockProps {
  block: BlockType;
  onDragStart: (blockId: string) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent, blockId: string) => void;
  onDrop: (e: React.DragEvent, blockId: string) => void;
  isDragging: boolean;
  isDropTarget: boolean;
  dropPosition?: 'before' | 'after' | 'column';
}

export function DraggableBlock({
  block,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
  isDropTarget,
  dropPosition
}: DraggableBlockProps) {
  const [showHandle, setShowHandle] = useState(false);
  const [handleHovered, setHandleHovered] = useState(false);

  const renderContent = () => {
    switch (block.type) {
      case 'heading':
        return <h2 className="text-2xl font-bold">{block.content}</h2>;
      case 'list':
        return <li className="ml-6 list-disc">{block.content}</li>;
      case 'quote':
        return (
          <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600">
            {block.content}
          </blockquote>
        );
      default:
        return <p>{block.content}</p>;
    }
  };

  return (
    <div
      className={`draggable-block relative transition-all ${
        isDragging ? 'opacity-30' : ''
      } ${isDropTarget ? 'bg-blue-50' : ''} ${
        handleHovered ? 'bg-gray-50' : ''
      }`}
      onMouseEnter={() => setShowHandle(true)}
      onMouseLeave={() => {
        setShowHandle(false);
        setHandleHovered(false);
      }}
      onDragOver={(e) => onDragOver(e, block.id)}
      onDrop={(e) => onDrop(e, block.id)}
      data-block-id={block.id}
      style={{ 
        padding: '6px 16px 6px 16px',
        minHeight: '32px',
        marginBottom: '2px',
        position: 'relative',
        borderBottom: handleHovered ? '3px solid #1677ff' : '3px solid transparent',
        backgroundColor: handleHovered ? '#f5f7fa' : 'transparent',
        transition: 'all 0.15s ease'
      }}
    >
      {/* 左侧热区 - 扩展可触发区域，但不遮挡句柄 */}
      <div
        className="left-hover-zone"
        style={{
          position: 'absolute',
          left: '-60px',
          top: '0',
          bottom: '0',
          width: '14px', // 只覆盖句柄左侧的空白区域
          zIndex: 0,
        }}
        onMouseEnter={() => setShowHandle(true)}
      />
      {showHandle && (
        <DragHandle
          blockId={block.id}
          onDragStart={() => onDragStart(block.id)}
          onDragEnd={onDragEnd}
          onHandleHover={setHandleHovered}
        />
      )}
      
      {dropPosition === 'before' && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded" style={{ top: '-2px' }} />
      )}
      
      {dropPosition === 'after' && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500 rounded" style={{ bottom: '-2px' }} />
      )}
      
      {dropPosition === 'column' && (
        <div className="absolute top-0 bottom-0 right-0 w-1 bg-blue-500 rounded" style={{ right: '-2px' }} />
      )}
      
      <div className="block-content">
        {renderContent()}
      </div>
    </div>
  );
}