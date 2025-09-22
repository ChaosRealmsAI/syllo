"use client";

import React, { useState } from "react";
import styles from "../../styles/editor.module.css";
import { BlockDragToolbar } from "../../toolbar/BlockDragToolbar";
import { Block } from "./Block";

interface BlockWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  showToolbar?: boolean;
  onDragStart?: (id: string) => void;
  onDragEnd?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export const BlockWrapper: React.FC<BlockWrapperProps> = ({
  id,
  children,
  className,
  showToolbar = true,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}) => {
  const [showHandle, setShowHandle] = useState(false);

  const handleMenuItemClick = (item: any) => {
    console.log("Menu item clicked:", item);
    // TODO: Handle menu actions based on item
  };

  return (
    <div
      className={styles.blockContainer}
      onMouseEnter={() => setShowHandle(true)}
      onMouseLeave={() => setShowHandle(false)}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {showToolbar && showHandle && (
        <div className={styles.dragHandleWrapper}>
          <BlockDragToolbar
            onMenuItemClick={handleMenuItemClick}
            onDragStart={(e) => onDragStart?.(id)}
            onDragEnd={onDragEnd}
          />
        </div>
      )}
      <Block id={id} className={className}>
        {children}
      </Block>
    </div>
  );
};