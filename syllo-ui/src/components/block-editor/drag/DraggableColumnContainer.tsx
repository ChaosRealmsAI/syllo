"use client";

import React from "react";
import {
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Block } from "./types";
import { DraggableBlockEnhanced } from "./DraggableBlockEnhanced";
import styles from "../styles/drag.module.css";

interface DraggableColumnContainerProps {
  id: string;
  title?: string;
  blocks: Block[];
  orientation?: "vertical" | "horizontal";
  renderBlock: (block: Block, index: number) => React.ReactNode;
  className?: string;
}

export const DraggableColumnContainer: React.FC<DraggableColumnContainerProps> = ({
  id,
  title,
  blocks,
  orientation = "vertical",
  renderBlock,
  className = "",
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: "container",
      orientation,
      accepts: ["block"],
    },
  });

  const sortingStrategy =
    orientation === "horizontal"
      ? horizontalListSortingStrategy
      : verticalListSortingStrategy;

  return (
    <div
      ref={setNodeRef}
      className={`
        ${styles.columnContainer}
        ${orientation === "horizontal" ? styles.horizontalContainer : styles.verticalContainer}
        ${isOver ? styles.containerOver : ""}
        ${className}
      `}
      data-container-id={id}
    >
      {title && (
        <div className={styles.containerTitle}>
          <h3>{title}</h3>
        </div>
      )}

      <SortableContext
        items={blocks.map(b => b.id)}
        strategy={sortingStrategy}
      >
        <div className={`
          ${styles.containerContent}
          ${orientation === "horizontal" ? "flex flex-row gap-4" : "flex flex-col gap-2"}
        `}>
          {blocks.map((block, index) => (
            <DraggableBlockEnhanced
              key={block.id}
              block={block}
              index={index}
              orientation={orientation}
              containerId={id}
            >
              {renderBlock(block, index)}
            </DraggableBlockEnhanced>
          ))}

          {/* 空状态 */}
          {blocks.length === 0 && (
            <div className={styles.emptyContainer}>
              <span>拖拽块到这里</span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};