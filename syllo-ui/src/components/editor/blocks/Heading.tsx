"use client";

import React from "react";
import styles from "../styles/editor.module.css";
import { CollapseButton } from "../ui/CollapseButton";

interface HeadingProps {
  level: 1 | 2 | 3;
  children: React.ReactNode;
  showCollapseButton?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

export const Heading: React.FC<HeadingProps> = ({
  level,
  children,
  showCollapseButton = true,
  onCollapse,
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  const className = level === 1
    ? styles.headingH1
    : level === 2
    ? styles.headingH2
    : styles.headingH3;

  return (
    <div className={`${styles.heading} ${className}`}>
      {showCollapseButton && <CollapseButton onToggle={onCollapse} />}
      <HeadingTag>{children}</HeadingTag>
    </div>
  );
};