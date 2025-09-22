"use client";

import React from "react";
import styles from "../../styles/editor.module.css";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, className }) => {
  return (
    <div className={`${styles.codeBlock} ${className || ""}`} data-language={language}>
      {code}
    </div>
  );
};