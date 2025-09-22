"use client";

import React, { useState, useRef } from "react";
import styles from "../styles/editor.module.css";
import { Column } from "./Column";
import { ColumnResizer } from "./ColumnResizer";

export interface ColumnData {
  id: string;
  width: number;
  content: React.ReactNode;
}

interface ColumnLayoutProps {
  columns: ColumnData[];
  onColumnsChange?: (columns: ColumnData[]) => void;
  className?: string;
}

export const ColumnLayout: React.FC<ColumnLayoutProps> = ({
  columns: initialColumns,
  onColumnsChange,
  className,
}) => {
  const [columns, setColumns] = useState(initialColumns);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleResizerDrag = (index: number, deltaX: number) => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaPercent = (deltaX / containerWidth) * 100;

    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const leftColumn = newColumns[index];
      const rightColumn = newColumns[index + 1];

      const newLeftWidth = leftColumn.width + deltaPercent;
      const newRightWidth = rightColumn.width - deltaPercent;

      // Minimum width constraint
      if (newLeftWidth > 10 && newRightWidth > 10) {
        leftColumn.width = newLeftWidth;
        rightColumn.width = newRightWidth;
        onColumnsChange?.(newColumns);
        return newColumns;
      }
      return prevColumns;
    });
  };

  const handleAddColumn = (afterIndex: number) => {
    const newColumn: ColumnData = {
      id: `column-${Date.now()}`,
      width: 25,
      content: <p className={styles.paragraph}>新添加的列</p>,
    };

    // Insert new column and redistribute widths
    const newColumns = [
      ...columns.slice(0, afterIndex + 1),
      newColumn,
      ...columns.slice(afterIndex + 1),
    ];

    // Recalculate widths to maintain 100%
    const newWidth = Math.floor(100 / newColumns.length);
    const adjustedColumns = newColumns.map((col, index) => ({
      ...col,
      width: index === newColumns.length - 1
        ? 100 - newWidth * (newColumns.length - 1)  // Last column takes remainder
        : newWidth,
    }));

    setColumns(adjustedColumns);
    onColumnsChange?.(adjustedColumns);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.gridContainer} ${
        draggingIndex !== null ? styles.dragging : ""
      } ${className || ""}`}
    >
      {columns.map((column, index) => (
        <React.Fragment key={column.id}>
          <Column
            width={column.width}
            isActiveLeft={draggingIndex === index - 1}
            isActiveRight={draggingIndex === index}
          >
            {column.content}
          </Column>

          {index < columns.length - 1 && (
            <ColumnResizer
              onDrag={(deltaX) => handleResizerDrag(index, deltaX)}
              onDragStart={() => setDraggingIndex(index)}
              onDragEnd={() => setDraggingIndex(null)}
              onAddColumn={() => handleAddColumn(index)}
            />
          )}
        </React.Fragment>
      ))}

      {/* Disabled gap at the end */}
      <div className={`${styles.columnGap} ${styles.disabled}`}>
        <div className={styles.columnGapInner}>
          <div className={styles.dragger}></div>
          <div className={styles.gapDots}>
            <div className={styles.gapDot}></div>
            <div className={styles.gapDot}></div>
            <div className={styles.gapDot}></div>
          </div>
        </div>
      </div>
    </div>
  );
};