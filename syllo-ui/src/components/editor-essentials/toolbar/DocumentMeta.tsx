"use client";

import React from "react";
import styles from "../styles/editor.module.css";

interface DocumentMetaProps {
  author?: string;
  lastModified?: string;
}

export const DocumentMeta: React.FC<DocumentMetaProps> = ({
  author = "用户",
  lastModified = "今天修改",
}) => {
  return (
    <div className={styles.docMeta}>
      <div className={styles.metaGroup}>
        <div className={styles.metaAuthor}>
          <div className={styles.avatarWrapper || "avatar-wrapper"}>
            <span className={styles.avatarInitial || "avatar-initial"}>{author[0].toUpperCase()}</span>
          </div>
          <span className={styles.metaText}>{author}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.862 3.138a.5.5 0 010 .707L5.707 9H8.5a.5.5 0 010 1h-4a.5.5 0 01-.5-.5v-4a.5.5 0 011 0v2.793l5.155-5.155a.5.5 0 01.707 0z" fill="currentColor"/>
          </svg>
        </div>
      </div>
      <div className={styles.metaGroup}>
        <span className={styles.metaText}>{lastModified}</span>
      </div>
    </div>
  );
};