import { Block } from "../types";

/**
 * 计算拖拽位置（上半部分还是下半部分）
 */
export const calculateDropPosition = (
  event: MouseEvent | TouchEvent,
  element: HTMLElement
): "before" | "after" => {
  const rect = element.getBoundingClientRect();
  const y = "clientY" in event ? event.clientY : event.touches[0].clientY;
  const relativeY = y - rect.top;
  const threshold = rect.height / 2;

  return relativeY < threshold ? "before" : "after";
};

/**
 * 计算横向拖拽位置（左边缘、右边缘还是中间）
 */
export const calculateHorizontalDropPosition = (
  event: MouseEvent | TouchEvent,
  element: HTMLElement
): "left" | "right" | "center" => {
  const rect = element.getBoundingClientRect();
  const x = "clientX" in event ? event.clientX : event.touches[0].clientX;
  const relativeX = x - rect.left;
  const edgeThreshold = 40; // 边缘区域的像素宽度

  if (relativeX < edgeThreshold) {
    return "left";
  } else if (relativeX > rect.width - edgeThreshold) {
    return "right";
  }
  return "center";
};

/**
 * 展平嵌套的块结构
 */
export const flattenBlocks = (blocks: Block[]): Block[] => {
  const result: Block[] = [];

  const flatten = (blocks: Block[]) => {
    blocks.forEach(block => {
      result.push(block);
      if (block.children) {
        flatten(block.children);
      }
    });
  };

  flatten(blocks);
  return result;
};

/**
 * 查找块的深度
 */
export const findBlockDepth = (
  blockId: string,
  blocks: Block[],
  depth = 0
): number => {
  for (const block of blocks) {
    if (block.id === blockId) {
      return depth;
    }
    if (block.children) {
      const found = findBlockDepth(blockId, block.children, depth + 1);
      if (found !== -1) {
        return found;
      }
    }
  }
  return -1;
};

/**
 * 检查是否可以放置到目标位置
 */
export const canDrop = (
  draggedBlock: Block,
  targetBlock: Block,
  position: "before" | "after" | "inside"
): boolean => {
  // 不能将块拖到自己内部
  if (draggedBlock.id === targetBlock.id) {
    return false;
  }

  // 不能将父块拖到子块内部
  const isDescendant = (parent: Block, childId: string): boolean => {
    if (parent.children) {
      for (const child of parent.children) {
        if (child.id === childId || isDescendant(child, childId)) {
          return true;
        }
      }
    }
    return false;
  };

  if (isDescendant(draggedBlock, targetBlock.id)) {
    return false;
  }

  // 某些块不能有子元素（如分割线）
  if (position === "inside" && targetBlock.type === "divider") {
    return false;
  }

  return true;
};

/**
 * 生成唯一ID
 */
export const generateId = (): string => {
  return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};