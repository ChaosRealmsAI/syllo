"use client";

import React from "react";
import styles from "../../styles/editor.module.css";

interface DividerProps {
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ className }) => {
  return <hr className={`${styles.divider} ${className || ""}`} />;
};