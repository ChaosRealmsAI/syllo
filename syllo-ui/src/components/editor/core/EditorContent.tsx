"use client";

import React from "react";
import { BlockWrapper } from "../blocks/base/BlockWrapper";
import { Heading } from "../blocks/text/Heading";
import { Paragraph } from "../blocks/text/Paragraph";
import { OrderedList } from "../blocks/list/OrderedList";
import { UnorderedList } from "../blocks/list/UnorderedList";
import { CodeBlock } from "../blocks/misc/CodeBlock";
import { Blockquote } from "../blocks/text/Blockquote";
import { Divider } from "../blocks/misc/Divider";
import { ColumnLayout, ColumnData } from "../layout/ColumnLayout";
import styles from "../styles/editor.module.css";

export interface EditorBlock {
  id: string;
  type: string;
  content: any;
}

interface EditorContentProps {
  blocks: EditorBlock[];
}

export const EditorContent: React.FC<EditorContentProps> = ({ blocks }) => {
  const renderBlockContent = (block: EditorBlock) => {
    switch (block.type) {
      case "heading1":
        return <Heading level={1}>{block.content}</Heading>;
      case "heading2":
        return <Heading level={2}>{block.content}</Heading>;
      case "heading3":
        return <Heading level={3}>{block.content}</Heading>;
      case "paragraph":
        return <Paragraph>{block.content}</Paragraph>;
      case "unorderedList":
        return <UnorderedList items={block.content} />;
      case "orderedList":
        return <OrderedList items={block.content} />;
      case "code":
        return <CodeBlock code={block.content} language="javascript" />;
      case "quote":
        return <Blockquote>{block.content}</Blockquote>;
      case "divider":
        return <Divider />;
      case "columns":
        return <ColumnLayout columns={block.content as ColumnData[]} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.editorContent}>
      {blocks.map((block) => (
        <BlockWrapper
          key={block.id}
          id={block.id}
          showToolbar={block.type !== "divider" && block.type !== "columns"}
        >
          {renderBlockContent(block)}
        </BlockWrapper>
      ))}
    </div>
  );
};