"use client";

import React, { useState } from "react";
import styles from "../styles/editor.module.css";

interface DocumentTitleProps {
  defaultTitle?: string;
  onChange?: (title: string) => void;
}

export const DocumentTitle: React.FC<DocumentTitleProps> = ({
  defaultTitle = "无标题文档",
  onChange,
}) => {
  const [title, setTitle] = useState(defaultTitle);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onChange?.(newTitle);
  };

  return (
    <input
      type="text"
      className={styles.docTitle}
      value={title}
      onChange={handleChange}
      placeholder="无标题文档"
    />
  );
};