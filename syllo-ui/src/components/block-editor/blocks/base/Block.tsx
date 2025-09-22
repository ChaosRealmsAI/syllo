"use client";

import React from "react";
import styles from "../../styles/editor.module.css";

interface BlockProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export const Block: React.FC<BlockProps> = ({
  id,
  children,
  className,
}) => {
  return (
    <div
      id={id}
      className={`${styles.contentBlock} ${className || ""}`}
      data-block-id={id}
    >
      {children}
    </div>
  );
};