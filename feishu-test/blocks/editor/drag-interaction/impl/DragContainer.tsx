'use client';

import React, { useState } from 'react';
import { DraggableBlock as BlockType } from '../contracts/drag.types';
import { DraggableBlock } from './DraggableBlock';

interface DragContainerProps {
  initialBlocks: BlockType[];
  onBlocksChange?: (blocks: BlockType[]) => void;
}

export function DragContainer({ initialBlocks, onBlocksChange }: DragContainerProps) {
  const [blocks, setBlocks] = useState<BlockType[]>(initialBlocks);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'before' | 'after' | 'column' | null>(null);

  const handleDragStart = (blockId: string) => {
    setDraggedBlockId(blockId);
  };

  const handleDragEnd = () => {
    setDraggedBlockId(null);
    setDropTargetId(null);
    setDropPosition(null);
  };

  const handleDragOver = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    if (draggedBlockId === targetBlockId) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const x = e.clientX - rect.left;
    const height = rect.height;
    const width = rect.width;
    
    // 判断拖拽位置
    if (x > width * 0.7) {
      // 右侧区域 - 创建列
      setDropPosition('column');
    } else if (y < height / 2) {
      // 上半部分 - 插入到前面
      setDropPosition('before');
    } else {
      // 下半部分 - 插入到后面
      setDropPosition('after');
    }
    
    setDropTargetId(targetBlockId);
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    
    const draggedId = e.dataTransfer.getData('blockId') || draggedBlockId;
    if (!draggedId || draggedId === targetBlockId) return;
    
    const newBlocks = [...blocks];
    const draggedIndex = newBlocks.findIndex(b => b.id === draggedId);
    const targetIndex = newBlocks.findIndex(b => b.id === targetBlockId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    if (dropPosition === 'column') {
      // TODO: 实现多列布局
      console.log('Creating column layout');
    } else {
      // 重新排序
      const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
      const newTargetIndex = dropPosition === 'before' ? targetIndex : targetIndex + 1;
      newBlocks.splice(newTargetIndex, 0, draggedBlock);
      
      setBlocks(newBlocks);
      onBlocksChange?.(newBlocks);
    }
    
    handleDragEnd();
  };

  return (
    <div className="drag-container w-full flex justify-center bg-white min-h-screen">
      <div className="relative" style={{ width: '900px', padding: '40px 0' }}>
        {blocks.map((block) => (
        <DraggableBlock
          key={block.id}
          block={block}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          isDragging={draggedBlockId === block.id}
          isDropTarget={dropTargetId === block.id}
          dropPosition={dropTargetId === block.id ? dropPosition : undefined}
        />
        ))}
      </div>
    </div>
  );
}