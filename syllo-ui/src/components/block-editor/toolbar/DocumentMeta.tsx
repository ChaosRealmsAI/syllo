"use client";

import React from "react";
import styles from "../styles/editor.module.css";
import { Avatar } from "../ui/Avatar";
import { EditIcon } from "../icons";

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
          <Avatar initial={author[0].toUpperCase()} />
          <span className={styles.metaText}>{author}</span>
          <EditIcon />
        </div>
      </div>
      <div className={styles.metaGroup}>
        <span className={styles.metaText}>{lastModified}</span>
      </div>
    </div>
  );
};