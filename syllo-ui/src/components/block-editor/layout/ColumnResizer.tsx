"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/editor.module.css";
import { AddColumnIcon } from "../icons";

interface ColumnResizerProps {
  onDrag: (deltaX: number) => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onAddColumn: () => void;
}

export const ColumnResizer: React.FC<ColumnResizerProps> = ({
  onDrag,
  onDragStart,
  onDragEnd,
  onAddColumn,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - currentXRef.current;
      currentXRef.current = e.clientX;
      onDrag(deltaX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      onDragEnd();
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onDrag, onDragEnd]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    startXRef.current = e.clientX;
    currentXRef.current = e.clientX;
    setIsDragging(true);
    onDragStart();
    document.body.style.cursor = "col-resize";
  };

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddColumn();
  };

  return (
    <div
      className={`${styles.columnGap} ${isDragging ? styles.dragging : ""}`}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.columnGapInner}>
        <div className={styles.dragger}></div>
        <div className={styles.gapDots}>
          <div className={styles.gapDot}></div>
          <div className={styles.gapDot}></div>
          <div className={styles.gapDot}></div>
        </div>
        <button className={styles.addColumn} onClick={handleAddClick}>
          <AddColumnIcon />
        </button>
      </div>
    </div>
  );
};