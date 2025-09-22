"use client";

import React from "react";
import styles from "../styles/editor.module.css";

interface AvatarProps {
  initial: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initial, className }) => {
  return <div className={`${styles.avatar} ${className || ""}`}>{initial}</div>;
};