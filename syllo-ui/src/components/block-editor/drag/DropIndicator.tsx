"use client";

import React from "react";
import styles from "../styles/drag.module.css";

interface DropIndicatorProps {
  position: "top" | "bottom" | "left" | "right";
  indent?: number;
  visible: boolean;
}

export const DropIndicator: React.FC<DropIndicatorProps> = ({
  position,
  indent = 0,
  visible,
}) => {
  if (!visible) return null;

  const getClassName = () => {
    switch (position) {
      case "top":
        return styles.dropIndicatorTop;
      case "bottom":
        return styles.dropIndicatorBottom;
      case "left":
        return styles.dropIndicatorLeft;
      case "right":
        return styles.dropIndicatorRight;
      default:
        return "";
    }
  };

  const style = indent > 0 ? { marginLeft: `${indent * 24}px` } : {};

  return (
    <div
      className={`${styles.dropIndicator} ${getClassName()}`}
      style={style}
    />
  );
};