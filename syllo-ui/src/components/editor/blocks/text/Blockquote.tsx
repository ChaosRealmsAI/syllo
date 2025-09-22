"use client";

import React from "react";
import styles from "../../styles/editor.module.css";

interface BlockquoteProps {
  children: React.ReactNode;
  className?: string;
}

export const Blockquote: React.FC<BlockquoteProps> = ({ children, className }) => {
  return (
    <blockquote className={`${styles.blockquote} ${className || ""}`}>
      {children}
    </blockquote>
  );
};