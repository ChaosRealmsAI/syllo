"use client";

import React from "react";
import styles from "../../styles/editor.module.css";
import { CollapseButton } from "../../ui/CollapseButton";

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5;
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
    : level === 3
    ? styles.headingH3
    : level === 4
    ? styles.headingH4
    : styles.headingH5;

  return (
    <div className={`${styles.heading} ${className}`}>
      {showCollapseButton && <CollapseButton onToggle={onCollapse} />}
      <HeadingTag>{children}</HeadingTag>
    </div>
  );
};