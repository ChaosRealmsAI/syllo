"use client";

import React from "react";
import styles from "../styles/editor.module.css";

export const Toolbar: React.FC = () => {
  return (
    <div className={styles.editorToolbar}>
      <button className={styles.toolbarBtn}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>添加图标</span>
      </button>
      <button className={styles.toolbarBtn}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1"/>
          <path d="M2 8h12" stroke="currentColor" strokeWidth="1"/>
        </svg>
        <span>添加封面</span>
      </button>
    </div>
  );
};