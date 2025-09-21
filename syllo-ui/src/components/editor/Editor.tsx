"use client";

import React, { useState } from "react";
import styles from "./styles/editor.module.css";
import { Toolbar } from "./Toolbar";
import { DocumentTitle } from "./DocumentTitle";
import { DocumentMeta } from "./DocumentMeta";
import { Block } from "./blocks/Block";
import { Heading } from "./blocks/Heading";
import { Paragraph } from "./blocks/Paragraph";
import { OrderedList } from "./blocks/OrderedList";
import { UnorderedList } from "./blocks/UnorderedList";
import { CodeBlock } from "./blocks/CodeBlock";
import { Blockquote } from "./blocks/Blockquote";
import { Divider } from "./blocks/Divider";
import { ColumnLayout, ColumnData } from "./layout/ColumnLayout";

interface EditorBlock {
  id: string;
  type: string;
  content: any;
}

export const Editor: React.FC = () => {
  const [blocks, setBlocks] = useState<EditorBlock[]>([
    { id: "block-1", type: "heading1", content: "一级标题示例" },
    {
      id: "block-2",
      type: "paragraph",
      content:
        "这是一个为Tiptap集成准备的纯UI版本。所有样式都已经提取为CSS变量，方便后续与Tiptap编辑器集成。",
    },
    { id: "block-3", type: "heading2", content: "二级标题示例" },
    {
      id: "block-4",
      type: "unorderedList",
      content: ["CSS变量系统已完善", "预留了Tiptap样式覆盖", "保持飞书视觉风格"],
    },
    {
      id: "block-5",
      type: "code",
      content: `// Tiptap集成示例代码
import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
  element: document.querySelector('.tiptap-editor-container'),
  extensions: [StarterKit],
  content: '<p>Hello World!</p>',
})`,
    },
    {
      id: "block-6",
      type: "quote",
      content: "这个纯UI版本可以直接作为Tiptap的样式基础，无需重构。",
    },
    { id: "block-7", type: "divider", content: null },
    { id: "block-8", type: "heading3", content: "三级标题示例" },
    {
      id: "block-9",
      type: "paragraph",
      content: "所有交互效果都通过CSS实现，不依赖JavaScript编辑逻辑，便于后续集成。",
    },
    { id: "block-10", type: "divider", content: null },
    { id: "block-11", type: "heading2", content: "多列内容展示" },
    {
      id: "block-12",
      type: "columns",
      content: [
        {
          id: "col-1",
          width: 26,
          content: (
            <OrderedList
              items={[
                {
                  id: "list-1",
                  content: "第一项内容",
                  children: [
                    {
                      id: "list-1-a",
                      content: "子项内容",
                      children: [
                        {
                          id: "list-1-a-i",
                          content: "三级内容",
                        },
                      ],
                    },
                    {
                      id: "list-1-b",
                      content: "第二个子项",
                    },
                  ],
                },
              ]}
            />
          ),
        },
        {
          id: "col-2",
          width: 41,
          content: (
            <>
              <OrderedList
                items={[
                  {
                    id: "list-2",
                    content: "中间列的内容",
                  },
                ]}
              />
              <Paragraph>
                这一列占据了41%的宽度，是三列中最宽的一列。可以放置更多的内容。
              </Paragraph>
            </>
          ),
        },
        {
          id: "col-3",
          width: 33,
          content: (
            <>
              <div className={styles.heading + " " + styles.headingH3}>
                <h3>列标题</h3>
              </div>
              <Paragraph>
                第三列的内容。支持各种内容块，包括标题、段落、列表等。
              </Paragraph>
              <UnorderedList items={["项目一", "项目二", "项目三"]} />
            </>
          ),
        },
      ] as ColumnData[],
    },
    { id: "block-13", type: "heading2", content: "两列布局示例" },
    {
      id: "block-14",
      type: "columns",
      content: [
        {
          id: "col-4",
          width: 50,
          content: (
            <>
              <div className={styles.heading + " " + styles.headingH3}>
                <h3>左侧内容</h3>
              </div>
              <Paragraph>
                两列布局适合对比内容或并列展示信息。这种布局在飞书文档中非常常见。
              </Paragraph>
              <CodeBlock
                code={`// 左侧代码示例
function leftColumn() {
  return "左侧内容";
}`}
              />
            </>
          ),
        },
        {
          id: "col-5",
          width: 50,
          content: (
            <>
              <div className={styles.heading + " " + styles.headingH3}>
                <h3>右侧内容</h3>
              </div>
              <Paragraph>
                右侧可以展示对应的内容、示例或补充信息。列的宽度可以通过拖拽分隔器调整。
              </Paragraph>
              <Blockquote>
                Tiptap集成后，这些多列布局将支持实时拖拽调整宽度。
              </Blockquote>
            </>
          ),
        },
      ] as ColumnData[],
    },
  ]);

  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  const handleDragStart = (blockId: string) => {
    setDraggedBlockId(blockId);
  };

  const handleDragEnd = () => {
    setDraggedBlockId(null);
  };

  const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    if (!draggedBlockId || draggedBlockId === targetBlockId) return;

    const draggedIndex = blocks.findIndex((b) => b.id === draggedBlockId);
    const targetIndex = blocks.findIndex((b) => b.id === targetBlockId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedBlock);

    setBlocks(newBlocks);
  };

  const renderBlock = (block: EditorBlock) => {
    switch (block.type) {
      case "heading1":
        return (
          <Block
            key={block.id}
            id={block.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, block.id)}
          >
            <Heading level={1}>{block.content}</Heading>
          </Block>
        );
      case "heading2":
        return (
          <Block
            key={block.id}
            id={block.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, block.id)}
          >
            <Heading level={2}>{block.content}</Heading>
          </Block>
        );
      case "heading3":
        return (
          <Block
            key={block.id}
            id={block.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, block.id)}
          >
            <Heading level={3}>{block.content}</Heading>
          </Block>
        );
      case "paragraph":
        return (
          <Block
            key={block.id}
            id={block.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, block.id)}
          >
            <Paragraph>{block.content}</Paragraph>
          </Block>
        );
      case "unorderedList":
        return (
          <Block
            key={block.id}
            id={block.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, block.id)}
          >
            <UnorderedList items={block.content} />
          </Block>
        );
      case "code":
        return (
          <Block
            key={block.id}
            id={block.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, block.id)}
          >
            <CodeBlock code={block.content} language="javascript" />
          </Block>
        );
      case "quote":
        return (
          <Block
            key={block.id}
            id={block.id}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, block.id)}
          >
            <Blockquote>{block.content}</Blockquote>
          </Block>
        );
      case "divider":
        return (
          <Block
            key={block.id}
            id={block.id}
            draggable={false}
          >
            <Divider />
          </Block>
        );
      case "columns":
        return (
          <Block
            key={block.id}
            id={block.id}
            draggable={false}
          >
            <ColumnLayout columns={block.content} />
          </Block>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.editorWrapper}>
      <Toolbar />
      <DocumentTitle defaultTitle="飞书编辑器纯UI版" />
      <DocumentMeta author="用户" lastModified="今天修改" />

      <div className={styles.editorContent}>
        {blocks.map((block) => renderBlock(block))}
      </div>
    </div>
  );
};