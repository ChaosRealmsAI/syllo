"use client";

import React from "react";
import styles from "./styles/editor.module.css";
import { AddIconIcon, AddCoverIcon } from "./icons";

export const Toolbar: React.FC = () => {
  return (
    <div className={styles.editorToolbar}>
      <button className={styles.toolbarBtn}>
        <AddIconIcon width={24} height={24} />
        <span>添加图标</span>
      </button>
      <button className={styles.toolbarBtn}>
        <AddCoverIcon width={16} height={16} />
        <span>添加封面</span>
      </button>
    </div>
  );
};