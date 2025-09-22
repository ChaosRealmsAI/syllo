"use client";

import React, { createContext, useContext, useState } from "react";
import { Block, DragState, DropIndicatorPosition } from "./types";

interface DragContextType {
  blocks: Block[];
  setBlocks: (blocks: Block[] | ((prev: Block[]) => Block[])) => void;
  dragState: DragState;
  setDragState: (state: DragState) => void;
  dropIndicator: DropIndicatorPosition | null;
  setDropIndicator: (position: DropIndicatorPosition | null) => void;
  moveBlock: (draggedId: string, targetId: string, position: "before" | "after") => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  findBlock: (id: string, blocks?: Block[]) => Block | null;
  findBlockParent: (id: string, blocks?: Block[]) => Block | null;
}

const DragContext = createContext<DragContextType | null>(null);

export const useDragContext = () => {
  const context = useContext(DragContext);
  if (!context) {
    throw new Error("useDragContext must be used within a DragProvider");
  }
  return context;
};

interface DragProviderProps {
  children: React.ReactNode;
  initialBlocks?: Block[];
}

export const DragProvider: React.FC<DragProviderProps> = ({
  children,
  initialBlocks = [],
}) => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [dragState, setDragState] = useState<DragState>({
    activeId: null,
    overId: null,
    dropPosition: "after",
  });
  const [dropIndicator, setDropIndicator] = useState<DropIndicatorPosition | null>(null);

  // 查找块
  const findBlock = (id: string, searchBlocks: Block[] = blocks): Block | null => {
    for (const block of searchBlocks) {
      if (block.id === id) return block;
      if (block.children) {
        const found = findBlock(id, block.children);
        if (found) return found;
      }
    }
    return null;
  };

  // 查找块的父级
  const findBlockParent = (id: string, searchBlocks: Block[] = blocks): Block | null => {
    for (const block of searchBlocks) {
      if (block.children?.some(child => child.id === id)) {
        return block;
      }
      if (block.children) {
        const found = findBlockParent(id, block.children);
        if (found) return found;
      }
    }
    return null;
  };

  // 移动块
  const moveBlock = (draggedId: string, targetId: string, position: "before" | "after") => {
    setBlocks(prevBlocks => {
      const newBlocks = JSON.parse(JSON.stringify(prevBlocks)); // 深拷贝

      // 查找并移除拖拽的块
      const removeBlock = (blocks: Block[], id: string): Block | null => {
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].id === id) {
            return blocks.splice(i, 1)[0];
          }
          if (blocks[i].children) {
            const removed = removeBlock(blocks[i].children!, id);
            if (removed) return removed;
          }
        }
        return null;
      };

      // 插入块到目标位置
      const insertBlock = (blocks: Block[], block: Block, targetId: string, position: "before" | "after"): boolean => {
        for (let i = 0; i < blocks.length; i++) {
          if (blocks[i].id === targetId) {
            const insertIndex = position === "before" ? i : i + 1;
            blocks.splice(insertIndex, 0, block);
            return true;
          }
          if (blocks[i].children) {
            const inserted = insertBlock(blocks[i].children!, block, targetId, position);
            if (inserted) return true;
          }
        }
        return false;
      };

      const draggedBlock = removeBlock(newBlocks, draggedId);
      if (draggedBlock) {
        insertBlock(newBlocks, draggedBlock, targetId, position);
      }

      return newBlocks;
    });
  };

  // 更新块
  const updateBlock = (id: string, updates: Partial<Block>) => {
    setBlocks(prevBlocks => {
      const updateInBlocks = (blocks: Block[]): Block[] => {
        return blocks.map(block => {
          if (block.id === id) {
            return { ...block, ...updates };
          }
          if (block.children) {
            return { ...block, children: updateInBlocks(block.children) };
          }
          return block;
        });
      };
      return updateInBlocks(prevBlocks);
    });
  };

  const value: DragContextType = {
    blocks,
    setBlocks,
    dragState,
    setDragState,
    dropIndicator,
    setDropIndicator,
    moveBlock,
    updateBlock,
    findBlock,
    findBlockParent,
  };

  return <DragContext.Provider value={value}>{children}</DragContext.Provider>;
};