"use client";

import React from "react";
import styles from "../styles/editor.module.css";

interface ParagraphProps {
  children: React.ReactNode;
  className?: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({ children, className }) => {
  return (
    <p className={`${styles.paragraph} ${className || ""}`}>
      {children}
    </p>
  );
};