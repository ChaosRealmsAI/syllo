"use client";

import React, { useState } from "react";
import styles from "../styles/editor.module.css";
import { ChevronDownIcon } from "../icons";

interface CollapseButtonProps {
  className?: string;
  onToggle?: (collapsed: boolean) => void;
  defaultCollapsed?: boolean;
}

export const CollapseButton: React.FC<CollapseButtonProps> = ({
  className,
  onToggle,
  defaultCollapsed = false,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onToggle?.(newCollapsed);
  };

  return (
    <button
      className={`${styles.collapseBtn} ${collapsed ? styles.collapsed : ""} ${className || ""}`}
      onClick={handleClick}
    >
      <ChevronDownIcon />
    </button>
  );
};