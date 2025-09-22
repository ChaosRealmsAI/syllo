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
// 导入新的组件
import { EditorTable } from "../blocks/markdown/Table";
import { CheckboxList } from "../blocks/markdown/CheckboxList";
import { LinkPreview } from "../blocks/reference/LinkPreview";
import { TaskCard } from "../blocks/task/TaskCard";
import { KanbanBoard } from "../blocks/task/KanbanBoard";
import { ColorHighlightBlock } from "../blocks/highlight/ColorHighlightBlock";
import styles from "../styles/editor.module.css";

export interface EditorBlock {
  id: string;
  type: string;
  content: any;
}

interface EditorContentProps {
  blocks: EditorBlock[];
  activeBlockId: string | null;
  setActiveBlockId: (id: string | null) => void;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  blocks,
  activeBlockId,
  setActiveBlockId
}) => {
  // 处理鼠标移动事件，确定当前悬浮的块
  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const blockElement = target.closest('[data-block-id]');
    const blockId = blockElement?.getAttribute('data-block-id');

    if (blockId && blockId !== activeBlockId) {
      setActiveBlockId(blockId);
    }
  }, [activeBlockId, setActiveBlockId]);

  // 处理鼠标离开编辑器区域
  const handleMouseLeave = React.useCallback(() => {
    setActiveBlockId(null);
  }, [setActiveBlockId]);

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
      // Markdown 扩展
      case "table":
        return (
          <EditorTable
            data={block.content}
            editable={true}
            onChange={(newData) => {
              // TODO: 更新block内容
              console.log("Table updated:", newData);
            }}
          />
        );
      case "checkboxList":
        return (
          <CheckboxList
            items={block.content}
            editable={true}
            onChange={(newItems) => {
              // TODO: 更新block内容
              console.log("Checkbox list updated:", newItems);
            }}
          />
        );
      // 文档引用
      case "linkPreview":
        return (
          <LinkPreview
            data={block.content}
            editable={true}
            onChange={(newData) => {
              // TODO: 更新block内容
              console.log("Link preview updated:", newData);
            }}
          />
        );
      // 任务管理
      case "taskCard":
        return (
          <TaskCard
            task={block.content}
            editable={true}
            draggable={true}
            onChange={(newTask) => {
              // TODO: 更新block内容
              console.log("Task updated:", newTask);
            }}
          />
        );
      case "kanbanBoard":
        return (
          <KanbanBoard
            data={block.content}
            editable={true}
            onChange={(newData) => {
              // TODO: 更新block内容
              console.log("Kanban board updated:", newData);
            }}
          />
        );
      // 高亮块
      case "highlightBlock":
        return (
          <ColorHighlightBlock
            data={block.content}
            editable={true}
            onChange={(newData) => {
              // TODO: 更新block内容
              console.log("Highlight block updated:", newData);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={styles.editorContent}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {blocks.map((block) => (
        <div
          key={block.id}
          data-block-id={block.id}
        >
          <BlockWrapper
            id={block.id}
            showToolbar={block.type !== "divider" && block.type !== "columns"}
            isActive={activeBlockId === block.id}
          >
            {renderBlockContent(block)}
          </BlockWrapper>
        </div>
      ))}
    </div>
  );
};