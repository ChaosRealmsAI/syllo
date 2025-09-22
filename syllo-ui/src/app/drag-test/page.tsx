"use client";

import React, { useState } from "react";
import { BlockWrapper } from "@/components/editor/blocks/base/BlockWrapper";
import { Heading } from "@/components/editor/blocks/text/Heading";
import { Paragraph } from "@/components/editor/blocks/text/Paragraph";
import styles from "@/components/editor/styles/editor.module.css";

interface TestBlock {
  id: string;
  type: "heading" | "paragraph";
  content: string;
}

export default function DragTestPage() {
  const [blocks, setBlocks] = useState<TestBlock[]>([
    { id: "1", type: "heading", content: "第一个标题" },
    { id: "2", type: "paragraph", content: "第一段内容" },
    { id: "3", type: "heading", content: "第二个标题" },
    { id: "4", type: "paragraph", content: "第二段内容" },
    { id: "5", type: "paragraph", content: "第三段内容" },
  ]);

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();

    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = blocks.findIndex(b => b.id === draggedId);
    const targetIndex = blocks.findIndex(b => b.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedBlock);

    setBlocks(newBlocks);
    setDragOverId(null);
  };

  return (
    <div className={styles.editorWrapper}>
      <h1 className={styles.docTitle}>拖拽测试页面</h1>

      <div className={styles.editorContent}>
        {blocks.map((block) => (
          <div key={block.id}>
            {/* 拖拽指示线 */}
            {dragOverId === block.id && draggedId !== block.id && (
              <div
                className={`${styles.dropIndicator} ${styles.active}`}
                style={{
                  height: '2px',
                  background: 'rgb(51, 112, 255)',
                  margin: '8px 0',
                }}
              />
            )}

            <BlockWrapper
              id={block.id}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, block.id)}
              onDrop={(e) => handleDrop(e, block.id)}
              className={draggedId === block.id ? styles.dragging : ""}
            >
              {block.type === "heading" ? (
                <Heading level={1}>{block.content}</Heading>
              ) : (
                <Paragraph>{block.content}</Paragraph>
              )}
            </BlockWrapper>
          </div>
        ))}
      </div>

      {/* 调试信息 */}
      <div style={{ marginTop: '40px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>调试信息</h3>
        <p>正在拖拽: {draggedId || '无'}</p>
        <p>悬停位置: {dragOverId || '无'}</p>
        <p>块顺序: {blocks.map(b => b.id).join(' → ')}</p>
      </div>
    </div>
  );
}