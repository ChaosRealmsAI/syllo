"use client";

import React from "react";
import styles from "../styles/editor.module.css";
import { TextIcon, DragDotsIcon } from "../icons";

interface DragHandleProps {
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export const DragHandle: React.FC<DragHandleProps> = ({ onDragStart, onDragEnd }) => {
  return (
    <div className={styles.dragHandleContainer}>
      <div
        className={styles.dragHandleTrigger}
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className={styles.dragHandleWrapper}>
          <div className={styles.dragHandleIconContainer}>
            <span className={styles.dragIcon}>
              <TextIcon />
            </span>
          </div>
          <span className={styles.dragHandleIcon}>
            <DragDotsIcon />
          </span>
        </div>
      </div>
    </div>
  );
};