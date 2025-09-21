"use client";

import React from "react";
import styles from "../styles/editor.module.css";

interface UnorderedListProps {
  items: string[];
  className?: string;
}

export const UnorderedList: React.FC<UnorderedListProps> = ({ items, className }) => {
  return (
    <ul className={`${styles.list} ${className || ""}`}>
      {items.map((item, index) => (
        <li key={index} className={styles.listItem}>
          {item}
        </li>
      ))}
    </ul>
  );
};