"use client";

import React, { useState } from "react";
import styles from "../styles/editor.module.css";
import { DragHandle } from "./DragHandle";

interface BlockProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  draggable?: boolean;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export const Block: React.FC<BlockProps> = ({
  id,
  children,
  className,
  draggable = true,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    onDragStart?.(id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    onDragEnd?.();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    onDragOver?.(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop?.(e);
  };

  return (
    <div
      className={`${styles.contentBlock} ${isDragging ? styles.dragging : ""} ${className || ""}`}
      data-block-id={id}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {draggable && (
        <DragHandle onDragStart={handleDragStart} onDragEnd={handleDragEnd} />
      )}
      {children}
    </div>
  );
};