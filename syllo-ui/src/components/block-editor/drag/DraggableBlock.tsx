"use client";

import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "./types";
import { useDragContext } from "./DragContext";
import { BlockDragToolbar } from "../toolbar/BlockDragToolbar";
import styles from "../styles/drag.module.css";

interface DraggableBlockProps {
  block: Block;
  children: React.ReactNode;
  index: number;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({
  block,
  children,
  index,
}) => {
  const { setDropIndicator, dropIndicator } = useDragContext();
  const [showHandle, setShowHandle] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    active,
    over,
  } = useSortable({
    id: block.id,
    data: { block, index },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 计算放置指示器位置
  React.useEffect(() => {
    if (isOver && active && active.id !== block.id) {
      setDropIndicator({
        targetId: block.id,
        position: "top", // 第一阶段只实现上下拖拽
        indent: 0,
      });
    } else if (!isOver && dropIndicator?.targetId === block.id) {
      setDropIndicator(null);
    }
  }, [isOver, active, block.id, setDropIndicator, dropIndicator]);

  const handleMenuItemClick = (item: any) => {
    console.log("Menu item clicked:", item);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${styles.draggableBlock} ${isDragging ? styles.dragging : ""}`}
      data-block-id={block.id}
    >
      {/* 放置指示器 - 顶部 */}
      {dropIndicator?.targetId === block.id && dropIndicator.position === "top" && (
        <div className={styles.dropIndicatorTop} />
      )}

      <div
        className={styles.blockContent}
        onMouseEnter={() => setShowHandle(true)}
        onMouseLeave={() => setShowHandle(false)}
      >
        {/* 拖拽手柄 */}
        {showHandle && !isDragging && (
          <div className={styles.dragHandleWrapper}>
            <BlockDragToolbar
              onMenuItemClick={handleMenuItemClick}
              onDragStart={(e) => {
                // BlockDragToolbar 会处理自己的拖拽
                e.stopPropagation();
              }}
              onDragEnd={() => {}}
              dragHandleRef={setActivatorNodeRef}
              dragHandleProps={{ ...attributes, ...listeners }}
            />
          </div>
        )}

        {/* 块内容 */}
        <div className={styles.blockInner}>
          {children}
        </div>
      </div>

      {/* 放置指示器 - 底部 */}
      {dropIndicator?.targetId === block.id && dropIndicator.position === "bottom" && (
        <div className={styles.dropIndicatorBottom} />
      )}
    </div>
  );
};