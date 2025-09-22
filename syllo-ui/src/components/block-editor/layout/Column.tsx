"use client";

import React from "react";
import styles from "../styles/editor.module.css";

interface ColumnProps {
  width: number;
  children: React.ReactNode;
  isActiveLeft?: boolean;
  isActiveRight?: boolean;
  className?: string;
}

export const Column: React.FC<ColumnProps> = ({
  width,
  children,
  isActiveLeft,
  isActiveRight,
  className,
}) => {
  const widthStyle = `calc(${width}% - 15px)`;

  return (
    <div
      className={`${styles.gridColumn} ${
        isActiveLeft ? styles.dragActiveLeft : ""
      } ${isActiveRight ? styles.dragActiveRight : ""} ${className || ""}`}
      style={{ width: widthStyle }}
    >
      <span className={styles.columnPercent}>{Math.round(width)}%</span>
      {children}
    </div>
  );
};