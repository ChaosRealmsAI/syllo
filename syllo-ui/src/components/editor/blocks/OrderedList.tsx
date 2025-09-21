"use client";

import React, { useState } from "react";
import styles from "../styles/editor.module.css";
import { ChevronDownIcon } from "../icons";

interface ListItem {
  id: string;
  content: React.ReactNode;
  children?: ListItem[];
}

interface OrderedListProps {
  items: ListItem[];
  startNumber?: string;
  numberStyle?: "1" | "a" | "i";
  depth?: number;
}

const getNumberFormat = (index: number, style: "1" | "a" | "i"): string => {
  switch (style) {
    case "a":
      return String.fromCharCode(97 + index) + ".";
    case "i":
      const romanNumerals = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
      return (romanNumerals[index] || String(index + 1)) + ".";
    default:
      return (index + 1) + ".";
  }
};

const ListItemComponent: React.FC<{
  item: ListItem;
  index: number;
  numberStyle: "1" | "a" | "i";
  depth: number;
}> = ({ item, index, numberStyle, depth }) => {
  const [collapsed, setCollapsed] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  const nextNumberStyle = depth === 0 ? "a" : depth === 1 ? "i" : "1";

  return (
    <div>
      <div className={styles.listWrapper}>
        {hasChildren && (
          <button
            className={`${styles.listFold} ${collapsed ? styles.collapsed : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              setCollapsed(!collapsed);
            }}
          >
            <ChevronDownIcon />
          </button>
        )}
        <button className={styles.orderButton}>
          {getNumberFormat(index, numberStyle)}
        </button>
        <div className={styles.listContent}>
          <div className={styles.paragraph}>{item.content}</div>
        </div>
      </div>

      {hasChildren && !collapsed && (
        <div className={styles.listChildren}>
          {item.children!.map((child, childIndex) => (
            <ListItemComponent
              key={child.id}
              item={child}
              index={childIndex}
              numberStyle={nextNumberStyle as "1" | "a" | "i"}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const OrderedList: React.FC<OrderedListProps> = ({
  items,
  numberStyle = "1",
  depth = 0,
}) => {
  return (
    <div className={styles.orderedList}>
      {items.map((item, index) => (
        <ListItemComponent
          key={item.id}
          item={item}
          index={index}
          numberStyle={numberStyle}
          depth={depth}
        />
      ))}
    </div>
  );
};