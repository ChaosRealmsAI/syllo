"use client";

import React, { useState, useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Block } from "./types";
import { useDragContext } from "./DragContext";
import { FramedDragHandle } from "@/components/drag-toolbar";
import styles from "../styles/drag.module.css";

interface DraggableBlockEnhancedProps {
  block: Block;
  children: React.ReactNode;
  index: number;
  orientation?: "vertical" | "horizontal";
  containerId?: string;
  showDragHandle?: boolean;
}

export const DraggableBlockEnhanced: React.FC<DraggableBlockEnhancedProps> = ({
  block,
  children,
  index,
  orientation = "vertical",
  containerId = "root",
  showDragHandle = true,
}) => {
  const { setDropIndicator, dropIndicator } = useDragContext();
  const [showHandle, setShowHandle] = useState(false);
  const [dropPosition, setDropPosition] = useState<"top" | "bottom" | "left" | "right" | null>(null);
  const blockRef = useRef<HTMLDivElement>(null);

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
    data: {
      block,
      index,
      containerId,
      orientation
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // 计算放置位置（支持横向和纵向）
  React.useEffect(() => {
    if (isOver && active && active.id !== block.id && blockRef.current) {
      const rect = blockRef.current.getBoundingClientRect();

      // 根据方向决定如何计算放置位置
      if (orientation === "horizontal") {
        // 横向排列时，计算左右位置
        const mouseX = window.mouseX || rect.left + rect.width / 2;
        const midX = rect.left + rect.width / 2;
        const position = mouseX < midX ? "left" : "right";

        setDropPosition(position);
        setDropIndicator({
          targetId: block.id,
          position: position,
          indent: 0,
        });
      } else {
        // 纵向排列时，计算上下位置
        const mouseY = window.mouseY || rect.top + rect.height / 2;
        const midY = rect.top + rect.height / 2;
        const position = mouseY < midY ? "top" : "bottom";

        setDropPosition(position);
        setDropIndicator({
          targetId: block.id,
          position: position,
          indent: 0,
        });
      }
    } else if (!isOver) {
      setDropPosition(null);
      if (dropIndicator?.targetId === block.id) {
        setDropIndicator(null);
      }
    }
  }, [isOver, active, block.id, orientation, setDropIndicator, dropIndicator]);

  // 记录鼠标位置（用于计算放置位置）
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      (window as any).mouseX = e.clientX;
      (window as any).mouseY = e.clientY;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        blockRef.current = node;
      }}
      style={style}
      className={`
        ${styles.draggableBlock}
        ${isDragging ? styles.dragging : ""}
        ${orientation === "horizontal" ? styles.horizontalBlock : ""}
      `}
      data-block-id={block.id}
      data-container-id={containerId}
    >
      {/* 放置指示器 - 根据方向显示 */}
      {dropPosition === "top" && (
        <div className={styles.dropIndicatorTop} />
      )}
      {dropPosition === "left" && (
        <div className={styles.dropIndicatorLeft} />
      )}

      <div
        className={styles.blockContent}
        onMouseEnter={() => setShowHandle(true)}
        onMouseLeave={() => setShowHandle(false)}
      >
        {/* 拖拽手柄 - 使用增强版 */}
        {showDragHandle && showHandle && !isDragging && (
          <div className={`
            ${styles.dragHandleWrapper}
            ${orientation === "horizontal" ? styles.dragHandleHorizontal : ""}
          `}>
            <FramedDragHandle
              dragHandleRef={setActivatorNodeRef}
              dragHandleProps={{ ...attributes, ...listeners }}
              darkMode={true}
              showBorder={true}
            />
          </div>
        )}

        {/* 块内容 */}
        <div className={styles.blockInner}>
          {children}
        </div>
      </div>

      {/* 放置指示器 - 根据方向显示 */}
      {dropPosition === "bottom" && (
        <div className={styles.dropIndicatorBottom} />
      )}
      {dropPosition === "right" && (
        <div className={styles.dropIndicatorRight} />
      )}
    </div>
  );
};